import { View } from '@ant-design/react-native';
import React from 'react'
import { StyleSheet } from 'react-native';
import Chat from '../Chat/Chat';
import ChatInput from '../Chat/ChatInput';

const ChatBot = ({
    messages,
    isLoading,
    chatStreaming,
    changeConversationLoading,
    handleSubmit,
    handleInputChange,
    input,
    setInput,
    stopStream,
    WelcomeMessage,
    chatConfig
  } : any) => {
    return (
      <View style={ChatbotStyle.container}>
        <Chat
          messages={messages}
          loading={isLoading}
          chatStreaming={chatStreaming}
          chatLoading={changeConversationLoading}
          WelcomeMessage={WelcomeMessage}
          chatConfig = {chatConfig}
        />
        <ChatInput 
          submitHandler={handleSubmit}
          handleInputChange={handleInputChange}
          input={input}
          loading={isLoading || chatStreaming}
          stopStream={stopStream}
        />
      </View>
    );
  };


  const ChatbotStyle = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        width : '100%',
        justifyContent: 'space-between',
        overflow: 'hidden',
        flex : 1,
        maxWidth : '100%',
        backgroundColor : '#ffffff'
    },
  });

export default ChatBot
