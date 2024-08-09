// src/components/ChatSDK.tsx
import {Button, Modal} from '@ant-design/react-native';
import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import useChatStore from '../store/chatStore';

interface ChatSDKProps {
  config: {
    buttonText?: string;
  };
}

const ChatSDK: React.FC<ChatSDKProps> = ({config}) => {
  const {chatVisible, toggleChat} = useChatStore();

  const init = () => {
    console.log('SDK Initialized with config:', config);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <View>
      <Button type="primary" onPress={toggleChat}>
        {config.buttonText || 'Open Chat'}
      </Button>

      <Modal
        visible={chatVisible}
        onClose={toggleChat}
        maskClosable={true}
        transparent>
        <View style={styles.modalContent}>
          <Text style={styles.chatTitle}>Chat Screen</Text>
          {/* Add your chat UI components here */}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 20,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChatSDK;
