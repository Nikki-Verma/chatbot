import {ChatSDKProvider, useChatSDK} from '@/context/ChatSDKContext';
import ChatScreen from '@/screens/ChatScreen';
import {ChatSDKConfig} from '@/types/ChatSDKConfig';
import {Button} from '@ant-design/react-native';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useChatStore} from './store/chatStore';

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
  const {showChat, toggleChat} = useChatStore();

  useEffect(() => {
    setChatbotConfig(config);
  }, [config, setChatbotConfig]);

  const handlePress = () => {
    toggleChat();
  };

  return (
    <View style={styles.container}>
      {showChat ? (
        <ChatScreen />
      ) : (
        <Button type="primary" onPress={handlePress}>
          Open Chat
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
