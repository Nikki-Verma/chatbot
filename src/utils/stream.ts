import { v4 as uuidv4 } from "uuid";
import _authHttp from "../services/authHttp";
import config from "./apiEndpoints";
import { ReadableStream, ReadableStreamDefaultReader } from "./type";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

interface CustomHeaders {
  [key: string]: string;
}

interface StreamResponse {
  headers: Headers; // This is the built-in Headers type
  stream: ReadableStream<Uint8Array> | null;
}

export const getStream = async (
  cId: string,
  mId: string,
  headers: CustomHeaders = {}
): Promise<StreamResponse> => {
  const query = {
    cId,
    mId,
  };

  const params = "?" + new URLSearchParams(query).toString();

  const response = await fetch(config.intract.streamResponse + params, {
    method: "GET",
    headers: {
      ...DEFAULT_HEADERS,
      ...headers,
    },
  });

  console.log("🚀 ~ response nikhil:", response)

  if (response.status === 511) {
    throw new Error("Session expired");
  }
  if (response.status === 102) return await getStream(cId, mId, headers);

  if (!response.ok) throw new Error(response.statusText);

  return { headers: response.headers, stream: response.body };
};

export const getChatDetails = async (
  
  chatId: string,
  params: Record<string, any>,
  headers?: CustomHeaders
): Promise<Array<{ role: string; content: string; id: string }>> => {
  const response = await _authHttp.get(`${config.intract.chatDetails}/${chatId}`, {
    params,
    headers: { ...DEFAULT_HEADERS, ...headers },
  });

  if (response?.status !== 200) {
    throw new Error("Error while fetching chat details");
  }

  const chatMessage =
    response?.data?.result?.response?.flatMap((chat: any) => {
      const userMessage = {
        role: "user",
        content: chat?.query?.message || "",
        id: 'nikhil',
      };
      const SimplAiMessage = {
        role: "SimplAi",
        content: chat?.query_result || "",
        id: 'nikhilasd',
      };
      return [userMessage, SimplAiMessage];
    }) || [];

  return chatMessage;
};

export async function* decodeStreamToJson(
  reader: ReadableStreamDefaultReader<Uint8Array>
): AsyncGenerator<string, void, unknown> {
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();

    if (done) break;

    if (value) {
      const decodedValue = decoder.decode(value).replace(/data:/g, "").trim();

      if (decodedValue.trim().toUpperCase() === "PROCESSING") {
        yield "refetch";
        break;
      }
      try {
        yield decodedValue;
      } catch (error) {
        console.error(error);
      }
    }
  }
}