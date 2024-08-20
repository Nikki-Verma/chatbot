import {isEqual} from 'lodash';
import React, {memo, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AudioVisualizerComponent from '../AudioVisualizerComponent';
import MicIcon from '../Icons/MicIcon';
import SendIcon from '../Icons/SendIcon';
import StopIcon from '../Icons/StopIcon';

type Props = {
  submitHandler: (val: any) => void;
  handleInputChange: (val: any) => void;
  input: string;
  loading: boolean;
  stopStream: () => void;
  agentId?: string;
};

const areEqual = (prevProps: any, nextProps: any) => {
  return (
    prevProps.input === nextProps.input &&
    prevProps.loading === nextProps.loading &&
    isEqual(prevProps.agentId, nextProps.agentId)
  );
};

const ChatInput: React.FC<Props> = memo(function ChatInput({
  submitHandler,
  loading,
  input,
  handleInputChange,
  stopStream,
  agentId = '669176ac6032166ba10c3ec5',
}: any) {
  const [audioVisualizerOpen, setAudioVisualizerOpen] = useState(false);

  const toggleAudioVisualizer = () => {
    setAudioVisualizerOpen(prev => !prev);
  };

  // const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
  //   if (e.nativeEvent.key === 'Enter') {
  //     e.preventDefault()
  //     submitHandler();
  //   }
  // };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Message..."
          value={input}
          onChangeText={handleInputChange}
          style={styles.textArea}
          multiline
          numberOfLines={1}
          scrollEnabled={true}
          // onKeyPress={handleKeyPress}
          onSubmitEditing={() => submitHandler()}
        />
        <View style={styles.rightColumn}>
          {!loading ? (
            <View style={styles.flexRow}>
              {!!agentId && (
                <TouchableOpacity onPress={toggleAudioVisualizer}>
                  <MicIcon />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => submitHandler()}>
                <SendIcon style={styles.sendIcon} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              key="stop-streaming"
              style={styles.stopButton}
              onPress={stopStream}>
              <StopIcon style={styles.stopIcon} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <SafeAreaView style={styles.container}>
        <AudioVisualizerComponent
          modalOpen={audioVisualizerOpen}
          onClose={toggleAudioVisualizer}
          agentId={agentId}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
},
areEqual);

export default ChatInput;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  textArea: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 20,
    maxHeight: 75,
  },
  rightColumn: {
    paddingHorizontal: 8,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  audioIcon: {
    fontSize: 24,
    color: '#444',
  },
  sendIcon: {
    fontSize: 24,
    color: '#c7c7c7',
    transform: [{rotate: '-90deg'}],
  },
  stopButton: {
    padding: 2,
  },
  stopIcon: {
    fontSize: 24,
    color: '#c7c7c7',
  },
  rightBadge: {
    color: '#444',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  shortcut: {
    backgroundColor: '#c7c2c2',
    paddingHorizontal: 4,
    borderRadius: 4,
    color: '#ffffff',
  },
});
