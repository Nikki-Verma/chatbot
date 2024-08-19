import {initiateConversationApi} from '@/api/interact';
import {useChatStore} from '@/store/chatStore';
import config from '@/utils/apiEndpoints';
import {useEffect, useRef, useState} from 'react';
import EventSource from 'react-native-sse';
import {v4 as uuidv4} from 'uuid';
import {X_SELLER_ID, X_SELLER_PROFILE_ID} from '../../../constant';
import {getChatDetails} from '../../utils/stream';

const SimplAi_ERROR_MESSAGE = 'Something went wrong fetching AI response.';

export enum ChunkType {
  TOOL_CALLS = 'tool_calls',
  TOOL = 'tool',
  CITATION = 'Citation',
}

interface CustomAttributes {
  [key: string]: any;
}

interface ChatConfig {
  model: string;
  language_code: string;
  source: string;
  model_id?: string;
  app_id?: any;
}

interface InputProps {
  messages?: any;
  convId?: string;
  convRefId?: string;
  chatConfig?: ChatConfig;
  customAttributes?: CustomAttributes;
}

const useChatStream = (input: InputProps) => {
  const streamRef = useRef<any>();
  const controller = new AbortController();
  const signal = controller.signal;

  const {userSessionConfig} = useChatStore();
  const [messages, setMessages] = useState(input?.messages ?? []);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatStreaming, setChatStreaming] = useState<boolean>(false);
  const [conversationId, setConversationId] = useState<string | undefined>(
    input?.convId ?? input?.convRefId,
  );
  const [conversationRefId, setConversationRefId] = useState<
    string | undefined
  >(input?.convRefId);
  const [changeConversationLoading, setChangeConversationLoading] =
    useState<boolean>(false);
  const [chatConfig, setChatConfig] = useState<ChatConfig>(
    input?.chatConfig ?? {
      model: '',
      language_code: 'EN',
      source: 'EMBED',
    },
  );
  const [custAtrr, setCustAtrr] = useState<CustomAttributes | undefined>(
    input?.customAttributes,
  );

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  useEffect(() => {
    changeConversation(conversationRefId);
  }, [conversationRefId]);

  useEffect(() => {
    signal.addEventListener?.('abort', () => {
      if (streamRef.current) {
        setChatStreaming(false);
        setIsLoading(false);
        streamRef.current.close();
      }
    });
  }, [signal]);

  const resetCustAtrr = () => {
    stopStream();
    setCustAtrr(undefined);
  };

  const handleInputChange = (value: string) => {
    setMessage(value);
  };

  const changeConversation = async (convId?: string) => {
    console.log('🚀 ~ changeConversation ~ convId:', convId);
    try {
      stopStream();
      setChangeConversationLoading(true);
      setConversationId(convId);
      setMessage('');
      if (convId) {
        setMessages([]);
        const chatDetails = await getChatDetails(convId, {
          userId: userSessionConfig?.userId,
          type: 'embed',
        });
        console.log('🚀 ~ changeConversation ~ chatDetails:', chatDetails);
        setMessages(chatDetails);
      } else {
        console.log('hello else');
        setMessages([]);
      }
    } catch (error) {
      console.log('🚀 ~ changeConversation ~ error:', error);
      setConversationId(undefined);
      setMessages([]);
    } finally {
      setChangeConversationLoading(false);
    }
  };

  const addMessageToChat = (message: string, role: string) => {
    setMessages((messages: any) => [
      ...messages,
      {role, content: message, id: uuidv4()},
    ]);
  };

  const appendMessageToChat = (message: string) => {
    setMessages((messages: string | any[]) => {
      if (messages.length > 0) {
        const latestMessage = messages[messages.length - 1];
        return [
          ...messages.slice(0, -1),
          {...latestMessage, content: `${latestMessage.content}${message}`},
        ];
      }
      return [...messages];
    });
  };

  const appendExtraMessageDetailsToChat = (type: ChunkType, data: any) => {
    setMessages((messages: string | any[]) => {
      const latestMessage = messages[messages.length - 1];

      switch (type) {
        case ChunkType.TOOL_CALLS:
          const newTools =
            data
              ?.map?.((toolData: any) => {
                if (Object.keys(toolData || {}).length > 0) {
                  const functionDetails = toolData.function || {};
                  return {...(toolData || {}), ...(functionDetails || {})};
                } else {
                  return null;
                }
              })
              ?.filter?.((toolData: any) => !!toolData) || null;
          return [
            ...messages.slice(0, -1),
            {...latestMessage, tools: newTools},
          ];

        case ChunkType.TOOL:
          const newToolwithDetails = latestMessage?.tools
            ? latestMessage.tools.map((toolData: any) => {
                if (toolData.id === data.tool_call_id) {
                  return {
                    ...toolData,
                    content: data.content,
                  };
                } else {
                  return {...toolData};
                }
              })
            : null;
          return [
            ...messages.slice(0, -1),
            {...latestMessage, tools: newToolwithDetails},
          ];

        case ChunkType.CITATION:
          const citations = latestMessage?.citations || {};
          data?.nodes?.forEach?.((citationChunk: any) => {
            if (citations?.[citationChunk?.metadata?.file_name]) {
              citations[citationChunk.metadata.file_name] = [
                ...(citations?.[citationChunk.metadata.file_name] || []),
                citationChunk,
              ];
            } else {
              citations[citationChunk.metadata.file_name] = [citationChunk];
            }
          });

          return [
            ...messages.slice(0, -1),
            {
              ...latestMessage,
              citations:
                Object.keys(citations || {}).length > 0 ? citations : null,
            },
          ];

        default:
          return [...messages];
      }
    });
  };

  const replaceMessageToChat = (message: string) => {
    setMessages((messages: string | any[]) => {
      const latestMessage = messages[messages.length - 1];
      return [...messages.slice(0, -1), {...latestMessage, content: message}];
    });
  };

  const fetchAndUpdateAIResponse = async (messageID: string) => {
    try {
      // startSSE(`${config.intract.streamResponse}/${messageID}/stream`)

      streamRef.current = new EventSource(
        `${config.intract.streamResponse}/${messageID}/stream`,
        {
          headers: {
            accept: 'text/event-stream',
          },
        },
      ); // Replace with your actual SSE endpoint
      console.log(
        '🚀 ~ fetchAndUpdateAIResponse ~ streamRef.current Nikhil:',
        streamRef.current,
      );

      streamRef?.current?.addEventListener('open', () => {
        console.log('Connection opened successfully');
      });

      streamRef?.current?.addEventListener?.(
        'message',
        async (event: {data: string}) => {
          console.log('Received event:', event);
          if (chatConfig.model_id?.includes('agent')) {
            const chatResponseChunkJson = JSON.parse(
              event.data.replace(/---->/g, '').replace(/<----/g, ''),
            );

            console.log('chatResponseChunkJson ', chatResponseChunkJson);

            if (
              chatResponseChunkJson.role?.toUpperCase() === 'ASSISTANT' &&
              !!chatResponseChunkJson.content
            ) {
              setIsLoading(false);
              appendMessageToChat(chatResponseChunkJson.content);
            } else if (
              chatResponseChunkJson.role?.toUpperCase() === 'ASSISTANT' &&
              chatResponseChunkJson.tool_calls?.length > 0
            ) {
              appendExtraMessageDetailsToChat(
                ChunkType.TOOL_CALLS,
                chatResponseChunkJson.tool_calls,
              );
            } else if (
              chatResponseChunkJson.role?.toUpperCase() === 'TOOL' &&
              !!chatResponseChunkJson.tool_call_id
            ) {
              appendExtraMessageDetailsToChat(
                ChunkType.TOOL,
                chatResponseChunkJson,
              );
            } else if (
              chatResponseChunkJson.role?.toUpperCase() === 'ASSISTANT' &&
              !!chatResponseChunkJson.citation_message
            ) {
              appendExtraMessageDetailsToChat(
                ChunkType.CITATION,
                chatResponseChunkJson.citation_message,
              );
            }
          } else {
            setIsLoading(false);
            appendMessageToChat(
              event.data.replace(/---->/g, '').replace(/<----/g, ''),
            );
          }
        },
      );

      streamRef?.current?.addEventListener('close', (event: any) => {
        console.log('Close SSE connection.', event);
      });

      if (streamRef.current) {
        streamRef?.current?.addEventListener('error', (error: any) => {
          // Handle any errors (e.g., connection closed)

          if (streamRef.current) {
            streamRef.current.close();
            console.log('user config: new new ', userSessionConfig);
            console.log('SSE error: ', error);
            streamRef.current = undefined;
            setChatStreaming(false);
            setIsLoading(false);
          }
        });
      }
    } catch (error) {
      console.log(`error while streaming`, error);
      streamRef.current = undefined;
      replaceMessageToChat(SimplAi_ERROR_MESSAGE);
      setChatStreaming(false);
      setIsLoading(false);
    }
  };

  const stopStream = async () => {
    console.log('signal', signal, controller, streamRef.current);
    if (signal && controller) {
      controller.abort();
    }
    if (streamRef.current) {
      streamRef.current.close();
      streamRef.current = undefined;
      setChatStreaming(false);
      setIsLoading(false);
    }
    setChatStreaming(false);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent, newMessage?: string) => {
    if (
      isLoading ||
      chatStreaming ||
      (!message.trim() && !newMessage?.trim())
    ) {
      return null;
    }
    setIsLoading(true);
    setChatStreaming(true);
    addMessageToChat(newMessage ?? message, 'user');
    setMessage('');
    try {
      addMessageToChat('', 'SimplAi');
      console.log('added message');

      const res = await initiateConversationApi({
        payload: {
          ...chatConfig,
          cust_attr: custAtrr,
          action: conversationId ? 'START_SCREEN' : 'START_SCREEN',
          query: {
            message: newMessage ?? message,
            message_type: 'text',
            message_category: '',
          },
          conversation_id: conversationId,
          ref_id: conversationRefId,
        },
        headers: {
          [X_SELLER_ID]: userSessionConfig?.userId,
          [X_SELLER_PROFILE_ID]: userSessionConfig?.userId,
        },
        signal,
      });
      console.log('🚀 ~ handleSubmit ~ res:', res);
      if (res?.data?.result?.conversation_id) {
        if (
          !conversationId ||
          res.data.result.conversation_id != conversationId
        ) {
          setConversationId(res.data.result.conversation_id);
        }
        await fetchAndUpdateAIResponse(res.data.result.message_id);
      }
    } catch (error) {
      console.log('🚀 ~ handleSubmit ~ error:', error);
      appendMessageToChat(SimplAi_ERROR_MESSAGE);
      setIsLoading(false);
      setChatStreaming(false);
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
    conversationRefId,
    setCustAtrr,
    setConversationRefId,
    resetCustAtrr,
  };
};

export default useChatStream;
