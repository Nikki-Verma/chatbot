import {getErrorFromApi, stringify} from '@/utils/helperFunctions';
import {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';

const audioRecorderPlayer = new AudioRecorderPlayer();

const requestPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ]);
    return (
      granted['android.permission.RECORD_AUDIO'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.READ_EXTERNAL_STORAGE'] ===
        PermissionsAndroid.RESULTS.GRANTED
    );
  }
  return true;
};

export const useConversation = (config: any) => {
  const [status, setStatus] = useState<string>('idle');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [recorderState, setRecorderState] = useState<
    'inactive' | 'recording' | 'paused'
  >('inactive');
  const [recorder, setRecorder] = useState<AudioRecorderPlayer | null>(null);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [userAudioData, setUserAudioData] = useState<number[]>([]);
  const [agentAudioData, setAgentAudioData] = useState<number[]>([]);
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<
    'none' | 'user' | 'agent'
  >('none');

  useEffect(() => {
    const playAudioBuffer = async (audioBuffer: string) => {
      try {
        console.log(`play audio buffer called:`);
        const path = `${RNFS.DocumentDirectoryPath}/temp_audio.mp3`;
        console.log('Writing audio data to file at:', path);

        // Ensure the audio buffer is base64 encoded
        await RNFS.writeFile(path, audioBuffer, 'base64');

        const sound = new Sound(path, Sound.MAIN_BUNDLE, error => {
          if (error) {
            console.log('Failed to load the sound', error);
            return;
          }
          sound.play(success => {
            if (success) {
              console.log('Successfully finished playing');
              sound.release();
              setCurrentSpeaker('user');
              setProcessing(false);
            } else {
              console.log('Playback failed due to audio decoding errors');
            }
          });
        });
      } catch (error) {
        console.error('Error during audio playback:', error);
      }
    };

    console.log(`Audio playback called successfully`, audioQueue, processing);

    if (!processing && audioQueue.length > 0) {
      setProcessing(true);
      const audio = audioQueue.shift();
      if (audio) {
        console.log('Processing audio:', audio);
        playAudioBuffer(audio);
      }
    }
  }, [audioQueue, processing]);

  const startConversation = async () => {
    const permissionsGranted = await requestPermissions();
    if (!permissionsGranted) {
      setError(new Error('Microphone or storage permissions not granted'));
      return;
    }

    setStatus('connecting');

    const backendUrl = await getBackendUrl();
    console.log('🚀 ~ startConversation ~ backendUrl:', backendUrl);

    const newSocket = new WebSocket(backendUrl);
    let error: Error | undefined;

    newSocket.onerror = event => {
      console.error('socket error:', event);
      error = new Error('See console for error details');
    };

    newSocket.onmessage = event => {
      const message = JSON.parse(event.data);
      console.log('Received WebSocket message:', message);
      if (message.type === 'websocket_audio') {
        setAudioQueue(prev => [...prev, message.data]);
      } else if (message.type === 'websocket_ready') {
        setStatus('connected');
      } else if (message.type === 'websocket_transcript') {
        setTranscripts(prev => {
          let last = prev.pop();
          if (last && last.sender === message.sender) {
            prev.push({
              sender: message.sender,
              text: last.text + ' ' + message.text,
            });
          } else {
            if (last) {
              prev.push(last);
            }
            prev.push({
              sender: message.sender,
              text: message.text,
            });
          }
          return prev;
        });
      }
    };

    newSocket.onclose = () => {
      console.log('socket closed:');
      stopConversation(error);
    };

    setSocket(newSocket);

    await new Promise(resolve => {
      const interval = setInterval(() => {
        console.log('socket connection state:', newSocket.readyState);
        if (newSocket.readyState === WebSocket.OPEN) {
          clearInterval(interval);
          resolve(null);
        }
      }, 100);
    });

    const options = {
      sampleRate: 16000, // Sample rate
      channels: 1, // Mono channel
      bitsPerSample: 16, // 16-bit PCM
      wavFile: 'test.wav', // Optional, only if you need to save the recording to a file
    };

    // AudioRecord.init(options);
    // AudioRecord.start();

    // // 4. Handle raw PCM data
    // AudioRecord.on('data', data => {
    //   // data is a buffer containing raw PCM audio data
    //   if (newSocket.readyState === WebSocket.OPEN) {
    //     const base64AudioData = Buffer.from(data).toString('base64');
    //     newSocket.send(
    //       JSON.stringify({
    //         type: 'websocket_audio',
    //         data: base64AudioData,
    //       }),
    //     );
    //   }
    // });
    try {
      let recorderToUse = recorder;
      console.log(
        '🚀 ~ startConversation ~ already exists recorderToUse:',
        recorderToUse,
      );
      if (recorderToUse && recorderState === 'paused') {
        recorderToUse.resumeRecorder();
      } else if (!recorderToUse) {
        recorderToUse = audioRecorderPlayer;
        console.log(
          '🚀 ~ startConversation ~ newly created recorderToUse:',
          recorderToUse,
        );
        setRecorder(recorderToUse);
      }

      const inputAudioMetadata = {
        samplingRate: 44100,
        audioEncoding: 'linear16',
      };

      const outputAudioMetadata = {
        samplingRate:
          config.audioDeviceConfig?.outputSamplingRate ||
          inputAudioMetadata.samplingRate,
        audioEncoding: 'linear16',
      };

      let startMessage: any;
      if (
        [
          'transcriberConfig',
          'agentConfig',
          'synthesizerConfig',
          'vocodeConfig',
        ].every(key => key in config)
      ) {
        startMessage = {
          type: 'websocket_start',
          transcriberConfig: Object.assign(
            config.transcriberConfig,
            inputAudioMetadata,
          ),
          agentConfig: config.agentConfig,
          synthesizerConfig: Object.assign(
            config.synthesizerConfig,
            outputAudioMetadata,
          ),
          conversationId: config.vocodeConfig?.conversationId,
          agent_id: config.agentId,
        };
      } else {
        const selfHostedConversationConfig = config;
        startMessage = {
          type: 'websocket_audio_config_start',
          inputAudioConfig: {
            samplingRate: inputAudioMetadata.samplingRate,
            audioEncoding: inputAudioMetadata.audioEncoding,
            chunkSize: selfHostedConversationConfig.chunkSize || 2048,
            downsampling: selfHostedConversationConfig.downsampling,
          },
          outputAudioConfig: {
            samplingRate: outputAudioMetadata.samplingRate,
            audioEncoding: outputAudioMetadata.audioEncoding,
          },
          conversationId: selfHostedConversationConfig.conversationId,
          subscribeTranscript: selfHostedConversationConfig.subscribeTranscript,
          agent_id: config.agentId,
        };
      }

      newSocket.send(stringify(startMessage));
      console.log('Access to microphone granted');
      console.log(startMessage);

      if (recorderState === 'recording') {
        console.log(`recorder state is not ready`, recorderState);
        return;
      }

      const path = Platform.select({
        ios: `${RNFS.DocumentDirectoryPath}/audio.m4a`,
        android: `${RNFS.ExternalStorageDirectoryPath}/audio.mp3`,
      });

      await recorderToUse.startRecorder();
      recorderToUse.addRecordBackListener(async (e: any) => {
        console.log(`Recording...`, e.currentPosition);
        const base64AudioData = await RNFS.readFile(path!, 'base64');
        if (newSocket.readyState === WebSocket.OPEN) {
          newSocket.send(
            stringify({
              type: 'websocket_audio',
              data: base64AudioData,
            }),
          );
        }
      });

      setRecorderState('recording');
    } catch (error) {
      console.error(
        'Error during recorder initialization:',
        getErrorFromApi(error),
      );
      stopConversation(error);
    }
  };

  const stopConversation = async (error?: any) => {
    if (recorderState === 'recording') {
      try {
        await audioRecorderPlayer.stopRecorder();
      } catch (err) {
        console.error('Error stopping recorder:', err);
      }
      setRecorderState('inactive');
    }

    if (socket) {
      socket.send(stringify({type: 'websocket_stop'}));
      socket.close();
      setSocket(null);
    }

    setStatus('idle');
    if (error) {
      setError(error);
    }
  };
  const getBackendUrl = async (): Promise<any> => {
    if ('backendUrl' in config) {
      return config.backendUrl!;
    } else if ('vocodeConfig' in config) {
      const baseUrl = config.vocodeConfig?.baseUrl || 'api.vocode.dev';
      return `wss://${baseUrl}/conversation?key=${config.vocodeConfig!.apiKey}`;
    } else {
      throw new Error('Invalid config');
    }
  };

  return {
    status,
    start: startConversation,
    stop: stopConversation,
    error,
    transcripts,
    userAudioData,
    agentAudioData,
    currentSpeaker,
  };
};
