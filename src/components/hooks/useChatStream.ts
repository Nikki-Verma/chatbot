import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { initiateConversationApi } from "../../api/interact";
import {
  decodeStreamToJson,
  getChatDetails,
  getStream,
} from "../../utils/stream";
import {
  A_ID,
  PIM_SID,
  X_CLIENT_ID,
  X_DEVICE_ID,
  X_SELLER_ID,
  X_SELLER_PROFILE_ID,
  X_TENANT_ID,
  X_USER_ID,
} from "../../../constant";
import { useChatStore } from "@/store/chatStore";
import { ReadableStreamDefaultReader } from "@/utils/type";
import { getErrorFromApi } from "@/utils/helperFunctions";
// import { useAppStore } from "../store";

const SimplAi_ERROR_MESSAGE = "Something went wrong fetching AI response.";


const useChatStream = (input: any) => {
  const {userSessionConfig} = useChatStore();

  const [messages, setMessages] = useState<any[]>(input?.messages ?? []);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatStreaming, setChatStreaming] = useState<boolean>(false);
  const [conversationId, setConversationId] = useState<string | undefined>(
    input?.convId
  );
  const [changeConversationLoading, setChangeConversationLoading] =
    useState<boolean>(false);
  const [chatConfig, setChatConfig] = useState<any>(
    input?.chatConfig ?? {
      model: "",
      language_code: "EN",
      source: "EMBED",
    }
  );


  const [custAtrr, setCustAtrr] = useState<Record<string, any> | undefined>(
    input?.customAttributes
  );

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  const resetCustAtrr = () => {
    stopStream();
    setCustAtrr(undefined);
  };

  const streamRef = useRef<ReadableStreamDefaultReader | null>(null);
  const stopStreamRef = useRef<boolean>(false);

  const handleInputChange = (text: string) => {
    setMessage(text);
  };

  const changeConversation = async (convId?: string) => {
    try {
      stopStream();
      setChangeConversationLoading(true);
      setConversationId(convId);
      setMessage("");
      if (convId) {
        setMessages([]);
        const chatDetails = await getChatDetails(convId, {
          userId: userSessionConfig?.userId,
        });
        setMessages(chatDetails);
      } else {
        setMessages([]);
      }
    } catch (error) {
      setMessages([]);
    } finally {
      setChangeConversationLoading(false);
    }
  };

  const addMessageToChat = (message: string, role: "user" | "SimplAi") => {

    setMessages((prevMessages) => [
      ...prevMessages,
      { role, content: message, 
        id: uuidv4()
    },
    ]);
  };

  const appendMessageToChat = (message: string) => {
    setMessages((prevMessages) => {
      const latestMessage = prevMessages[prevMessages.length - 1];
      return [
        ...prevMessages.slice(0, -1),
        { ...latestMessage, content: `${latestMessage.content}${message}` },
      ];
    });
  };

  const replaceMessageToChat = (message: string) => {
    setMessages((prevMessages) => {
      const latestMessage = prevMessages[prevMessages.length - 1];
      return [
        ...prevMessages.slice(0, -1),
        { ...latestMessage, content: message },
      ];
    });
  };

  const fetchAndUpdateAIResponse = async (
    messageID: string,
    conversationID: string,
    loadingState: boolean = true
  ) => {
    try {
      console.log('fetch ai response started',messageID,conversationID,loadingState,userSessionConfig)
      if (loadingState) setIsLoading(true);
      setChatStreaming(true);
      const { headers, stream } = await getStream(conversationID, messageID, {
        [X_USER_ID]: userSessionConfig?.userId,
        [X_SELLER_ID]: userSessionConfig?.userId,
        [X_SELLER_PROFILE_ID]: userSessionConfig?.userId,
        [X_TENANT_ID]: userSessionConfig?.TENANT_ID,
        [PIM_SID]: userSessionConfig?.PIM_SID,
        [A_ID]: userSessionConfig?.A_ID,
        [X_DEVICE_ID]: "armaze-web",
        [X_CLIENT_ID]: userSessionConfig?.userId,
      });

      if (!stream) throw new Error("No stream available");

      streamRef.current = stream.getReader();
      for await (const message of decodeStreamToJson(streamRef.current)) {
        if (stopStreamRef.current) {
          console.log("stop streaming called");
          stopStreamRef.current = false;
          setChatStreaming(false);
          setIsLoading(false);
          break;
        }
        if (message === "refetch") {
          setTimeout(() => {
            fetchAndUpdateAIResponse(messageID, conversationID);
          }, 50);
          break;
        }
        setIsLoading(false);
        replaceMessageToChat(message);
        if (headers?.get("Message_Status") !== "2") {
          fetchAndUpdateAIResponse(messageID, conversationID, false);
        } else {
          setChatStreaming(false);
        }
      }
    } catch (error) {
      console.log(`error in fetchandairesponse`,getErrorFromApi(error) )
      appendMessageToChat(SimplAi_ERROR_MESSAGE);
      setChatStreaming(false);
      setIsLoading(false);
    }
  };

  const stopStream = async () => {
    if (!streamRef.current) {
      return null;
    } else {
      console.log("🚀 ~ stopStream ~ stopStream triggered:");
      stopStreamRef.current = true;
      await streamRef.current.cancel();
      streamRef.current = null;
    }
  };

  const handleSubmit = async (newMessage?: string) => {
    if (isLoading || chatStreaming || (!message && !newMessage)) return null;
    setIsLoading(true);
    setChatStreaming(true);
    addMessageToChat(newMessage ?? message, "user");
    setMessage("");
    stopStreamRef.current = false;

    try {
      addMessageToChat("", "SimplAi");

      console.log(`before api call`,{
        ...chatConfig,
        cust_attr: custAtrr,
        action: conversationId ? "START_SCREEN" : "START_SCREEN",
        query: {
          message: newMessage ?? message,
          message_type: "text",
          message_category: "",
        },
        conversation_id: conversationId,
      },
      {
        [X_SELLER_ID]: userSessionConfig?.userId,
        [X_SELLER_PROFILE_ID]: userSessionConfig?.userId,
      })
      const res = await initiateConversationApi({
        payload: {
          ...chatConfig,
          cust_attr: custAtrr,
          action: conversationId ? "START_SCREEN" : "START_SCREEN",
          query: {
            message: newMessage ?? message,
            message_type: "text",
            message_category: "",
          },
          conversation_id: conversationId,
        },
        headers: {
          [X_SELLER_ID]: userSessionConfig?.userId,
          [X_SELLER_PROFILE_ID]: userSessionConfig?.userId,
        },
      });

      console.log(`after api call`,res)

      if (res?.data?.result?.conversation_id) {
        if (
          !conversationId ||
          res.data.result.conversation_id !== conversationId
        ) {
          setConversationId(res.data.result.conversation_id);
        }
        await fetchAndUpdateAIResponse(
          res.data.result.message_id,
          res.data.result.conversation_id
        );
      }
    } catch(error) {
      console.log(`error while fetching model response`,error)
      appendMessageToChat(SimplAi_ERROR_MESSAGE);
      setIsLoading(false);
      setChatStreaming(false);
    } finally {
      streamRef.current = null;
    }
  };

  return {
    conversationId,
    setConversationId,
    messages,
    setMessages,
    input: message,
    setInput: setMessage,
    handleInputChange,
    handleSubmit,
    isLoading,
    chatStreaming,
    stopStream,
    chatConfig,
    setChatConfig,
    changeConversation,
    changeConversationLoading,
    custAtrr,
    setCustAtrr,
    resetCustAtrr,
  };
};

export default useChatStream;