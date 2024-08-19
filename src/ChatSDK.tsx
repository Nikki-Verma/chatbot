import {ChatSDKProvider, useChatSDK} from '@/context/ChatSDKContext';
import ChatScreen from '@/screens/ChatScreen';
import {ChatSDKConfig} from '@/types/ChatSDKConfig';
import {Button} from '@ant-design/react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {v4 as uuidv4} from 'uuid';
import {A_ID, PIM_SID, X_TENANT_ID} from '../constant';
import useChatStream from './components/hooks/useChatStream';
import _authHttp from './services/authHttp';
import _unauthHttp from './services/unAuthHttp';
import {useChatStore} from './store/chatStore';
import apiEndpointConfig from './utils/apiEndpoints';
import {encryptData} from './utils/helperFunctions';

export const ChatSDK = {
  init: (config: ChatSDKConfig) => {
    return (
      <ChatSDKProvider>
        <ChatInit config={config} />
      </ChatSDKProvider>
    );
  },
};

const ChatInit = ({config}: {config: ChatSDKConfig}) => {
  console.log('🚀 ~ ChatInit ~ config:', config);
  const {setChatbotConfig} = useChatSDK();
  const {
    showChat,
    toggleChat,
    userSessionConfig,
    updateUserSessionConfig,
    resetUserSessionConfig,
  } = useChatStore();
  const [sessionFetching, setSessionFetching] = useState(true);

  useEffect(() => {
    setChatbotConfig(config);
  }, [config, setChatbotConfig]);

  const handlePress = () => {
    toggleChat();
  };

  useEffect(() => {
    if (!userSessionConfig?.PIM_SID) {
      getGuestSession();
    } else {
      setSessionFetching(false);
    }
  }, []);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    chatStreaming,
    setInput,
    changeConversation,
    changeConversationLoading,
    stopStream,
    setChatConfig,
    chatConfig,
  } = useChatStream({
    chatConfig: {
      model: '',
      language_code: 'EN',
      source: 'APP',
      app_id: '',
      model_id: '',
    },
  });

  const getGuestSession = async () => {
    try {
      setSessionFetching(true);
      console.log('hello', updateUserSessionConfig);
      console.log(`response se pehle sdkhvjbndsfkjvndfv`);
      const response = await _unauthHttp.get(
        apiEndpointConfig.identity.getGuestSession,
        {
          headers: {
            [X_TENANT_ID]: config?.TENANT_ID,
          },
        },
      );
      console.log(`response se baad   sldknv sdkhvjbndsfkjvndfv`);
      console.log('🚀 ~ getGuestSession ~ response:', response);
      console.log(
        '🚀 ~ getGuestSession ~ response?.headers:',
        response?.data?.result?.[0]?.token,
      );
      if (response.status === 200 && response?.data?.ok) {
        const dataToEncrypt = config?.TOKEN;
        const encryptionKey = response?.data?.result?.[0]?.token;
        // headers?.["pim-sid"];

        const encryptedData = encryptData(dataToEncrypt, encryptionKey);

        // const encryptedData = encryptData(dataToEncrypt, encryptionKey);
        console.log('Encrypted data:', encryptedData);

        const configResponse = await _authHttp.get(
          apiEndpointConfig.embed.config,
          {
            headers: {
              [PIM_SID]: response?.data?.result?.[0]?.token,
              [X_TENANT_ID]: config?.TENANT_ID,
              [A_ID]: encryptedData,
              type: 'embed',
            },
            params: {
              id: config?.APP_ID,
            },
          },
        );
        console.log('🚀 ~ getGuestSession ~ configResponse:', configResponse);
        if (configResponse?.status === 200) {
          // Usage example
          updateUserSessionConfig({
            userId: uuidv4(),
            PIM_SID: response?.data?.result?.[0]?.token,
            A_ID: encryptedData,
            TENANT_ID: config?.TENANT_ID,
            chatConfig: configResponse?.data,
          });
          setChatConfig({
            model: configResponse?.data?.app_name,
            language_code: 'EN',
            source: 'APP',
            app_id: configResponse?.data?.app_id,
            model_id: configResponse?.data?.model_id,
          });
        }
      }
    } catch (error) {
      console.log('error while getting guest session', error);
    } finally {
      setSessionFetching(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      {showChat ? (
        <ChatScreen
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          chatStreaming={chatStreaming}
          setInput={setInput}
          changeConversation={changeConversation}
          changeConversationLoading={changeConversationLoading}
          stopStream={stopStream}
          setChatConfig={setChatConfig}
          chatConfig={chatConfig}
        />
      ) : (
        <Button type="primary" onPress={handlePress}>
          Open Chat
        </Button>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
