import {stringify} from '@/utils/helperFunctions';
import {useEffect, useState} from 'react';
import AudioRecord from 'react-native-audio-record';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';

const requestPermissions = async (): Promise<boolean> => {
  // if (Platform.OS === 'android') {
  //   const granted = await PermissionsAndroid.requestMultiple([
  //     PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //     PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  //   ]);
  //   return (
  //     granted['android.permission.RECORD_AUDIO'] ===
  //       PermissionsAndroid.RESULTS.GRANTED &&
  //     granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
  //       PermissionsAndroid.RESULTS.GRANTED &&
  //     granted['android.permission.READ_EXTERNAL_STORAGE'] ===
  //       PermissionsAndroid.RESULTS.GRANTED
  //   );
  // }
  return true;
};

export const useConversation = (config: any) => {
  const [status, setStatus] = useState<string>('idle');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [recorderState, setRecorderState] = useState<
    'inactive' | 'recording' | 'paused'
  >('inactive');
  const [error, setError] = useState<Error | undefined>(undefined);
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<
    'none' | 'user' | 'agent'
  >('none');
  const [userAudioData, setUserAudioData] = useState<number[]>([]);
  const [agentAudioData, setAgentAudioData] = useState<number[]>([]);

  useEffect(() => {
    const playAudioBuffer = async (audioBuffer: string) => {
      try {
        const path = `${RNFS.DocumentDirectoryPath}/temp_audio.wav`;

        // Write the base64 encoded audio buffer to a file
        await RNFS.writeFile(path, audioBuffer, 'base64');

        // Check if the file exists
        const fileExists = await RNFS.exists(path);
        if (!fileExists) {
          console.error('File does not exist at path:', path);
          return;
        }

        console.log('File exists at path:', path);

        // Set the audio category for iOS
        Sound.setCategory('Playback', true);

        const sound = new Sound(path, '', error => {
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

    if (!processing && audioQueue.length > 0) {
      setProcessing(true);
      const audio = audioQueue.shift();
      if (audio) {
        playAudioBuffer(audio);
      }
    }
  }, [audioQueue, processing]);

  const startConversation = async () => {
    const permissionsGranted = await requestPermissions();

    console.log(`permissionsGranted: ${permissionsGranted}`);
    if (!permissionsGranted) {
      setError(new Error('Microphone or storage permissions not granted'));
      return;
    }

    setStatus('connecting');

    const backendUrl = await getBackendUrl();
    const newSocket = new WebSocket(backendUrl);
    let error: Error | undefined;

    newSocket.onerror = event => {
      console.error('socket error:', event);
      error = new Error('See console for error details');
    };

    newSocket.onmessage = event => {
      console.log('message received', event);
      const message = JSON.parse(event.data);
      if (message.type === 'websocket_audio') {
        setAgentAudioData(prev => [...Buffer.from(message.data, 'base64')]);
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
      console.log(`onclose called for stopconversation`, error);
      stopConversation(error);
    };

    setSocket(newSocket);

    await new Promise(resolve => {
      const interval = setInterval(() => {
        if (newSocket.readyState === WebSocket.OPEN) {
          clearInterval(interval);
          resolve(null);
        }
      }, 100);
    });

    try {
      const options = {
        sampleRate: 16000, // Sample rate
        channels: 1, // Mono channel
        bitsPerSample: 16, // 16-bit PCM
        audioSource: 6,
        wavFile: `${RNFS.DocumentDirectoryPath}/temp_audio.wav`, // Optional, only if you need to save the recording to a file
      };

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

      AudioRecord.init(options);

      console.log(`audio recording started`, AudioRecord);

      // Handle raw PCM data
      AudioRecord.on('data', data => {
        console.log(`Audio recording data received`, data);
        const chunk = Buffer.from(data, 'base64');
        console.log('AudioRecord captured data:', chunk); // Log data to debug
        if (data && data.length > 0) {
          // setUserAudioData((prev: any) => [...prev, ...data]);
          if (newSocket.readyState === WebSocket.OPEN) {
            const base64AudioData = Buffer.from(data).toString('base64');
            newSocket.send(
              JSON.stringify({
                type: 'websocket_audio',
                data: data,
              }),
            );
          }
        } else {
          console.warn('Received empty data from AudioRecord');
        }
      });

      AudioRecord.start();
      setRecorderState('recording');
    } catch (error) {
      console.log(`Audio recording error:`, error);
    }
  };

  const stopConversation = async (error?: any) => {
    console.log(`stop conversation called`, recorderState);
    if (recorderState === 'recording') {
      AudioRecord.stop();
      setRecorderState('inactive');
    }

    if (socket) {
      socket.send(JSON.stringify({type: 'websocket_stop'}));
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
