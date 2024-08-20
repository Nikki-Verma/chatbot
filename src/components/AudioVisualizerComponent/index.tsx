import {__AGENT_PUBLIC_BASE_URL__} from '@/utils/apiEndpoints';
import React, {useEffect, useState} from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useConversation} from '../hooks/conversation';
import AudioVisualizer from './AudioVisualizer';

const AudioVisualizerComponent = ({modalOpen, onClose, agentId}: any) => {
  const [backendUrl] = useState(`${__AGENT_PUBLIC_BASE_URL__}/conversation`);
  const config = {
    backendUrl,
    agentId,
    audioDeviceConfig: {},
  };

  const {status, start, stop, error, userAudioData, agentAudioData} =
    useConversation(config);

  useEffect(() => {
    if (modalOpen && status === 'idle') {
      start(); // Automatically start the conversation when the modal opens
    }

    return () => {
      console.log(`cleanup called for stopconversation`);
      stop(); // Clean up the conversation when the modal closes
    };
  }, [modalOpen]);

  const renderContent = () => {
    if (status === 'connecting') {
      return <Text style={styles.connectingText}>Connecting...</Text>;
    }

    if (status === 'connected') {
      return (
        <View style={styles.visualizerContainer}>
          <Text style={styles.speakerName}>Agent</Text>
          <AudioVisualizer base64AudioData={agentAudioData} isAgent={true} />
          <Text style={styles.speakerName}>You</Text>
          <AudioVisualizer base64AudioData={userAudioData} isAgent={false} />
          <TouchableOpacity
            onPress={() => {
              console.log(`onpress called for stopconversation`);
              stop();
            }}
            style={styles.button}>
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (status === 'error') {
      return (
        <Text style={styles.errorText}>
          Something went wrong: {error?.message}
        </Text>
      );
    }

    return (
      <TouchableOpacity onPress={() => start()} style={styles.button}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={modalOpen}
      onRequestClose={onClose}
      animationType="slide"
      transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.contentContainer}>
          {renderContent()}
          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    width: 300,
    alignItems: 'center',
  },
  connectingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#602EDF',
  },
  visualizerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  speakerName: {
    fontSize: 16,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#602EDF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AudioVisualizerComponent;
