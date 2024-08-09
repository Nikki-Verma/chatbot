import {useChatSDK} from '@/context/ChatSDKContext';
import {useChatStore} from '@/store/chatStore';
import {Button} from '@ant-design/react-native';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const ChatScreen = () => {
  const {chatbotConfig} = useChatSDK();
  const {showChat, toggleChat} = useChatStore();
  console.log('hello there');

  if (!chatbotConfig || !chatbotConfig.botName || !chatbotConfig.botKey) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Configuration incorrect. Please check your settings.
        </Text>
      </View>
    );
  }

  const startChat = () => {
    // Your logic to initiate chat using botName and botKey

    toggleChat();
  };

  return (
    <View style={styles.container}>
      <Button type="primary" onPress={startChat}>
        Start Chat
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 0,
    width: '100%',
    backgroundColor: 'red',
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

export default ChatScreen;
