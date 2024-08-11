import ChatHeader from '@/components/ChatHeader';
import ChatBot from '@/components/Chatbot';
import useChatStream from '@/components/hooks/useChatStream';
import {useChatSDK} from '@/context/ChatSDKContext';
import {useChatStore} from '@/store/chatStore';
import {Button} from '@ant-design/react-native';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const ChatScreen = ({
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
} : any) => {
  const {chatbotConfig} = useChatSDK();
  const {showChat, toggleChat} = useChatStore();
  console.log('hello there');

  if (!chatbotConfig || !chatbotConfig.TOKEN || !chatbotConfig.APP_ID || !chatbotConfig?.TENANT_ID) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Configuration incorrect. Please check your settings.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ChatHeader
      />
      <ChatBot
        messages={messages}
        isLoading={isLoading}
        chatStreaming={chatStreaming}
        changeConversationLoading={changeConversationLoading}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        input={input}
        setInput={setInput}
        stopStream={stopStream}
        WelcomeMessage={"Hello user"}
        chatConfig = {chatConfig}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 0,
    width: '100%',
    backgroundColor: 'blue',
    flex: 1,
    flexDirection : 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderTopLeftRadius : 12,
    borderTopRightRadius : 12,
    height : '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default ChatScreen;
