import CryptoJS from 'crypto-js';
import {snakeCase} from 'snake-case';

export const encryptData = (data: string, key: string): string => {
  const truncatedKey = CryptoJS.enc.Utf8.parse(key.slice(0, 16));
  const encrypted = CryptoJS.AES.encrypt(data, truncatedKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

export const getErrorFromApi = (
  res: any,
  defaultMessage: any = 'Something went wrong!',
) => {
  if (typeof res === 'string') {
    return res;
  }
  if (res?.response) {
    const error =
      res?.response?.data?.detail &&
      typeof res?.response?.data?.detail === 'string'
        ? res?.response?.data?.detail
        : res?.response?.data?.detail?.[0]?.msg &&
          typeof res?.response?.data?.detail?.[0]?.msg === 'string'
        ? res?.response?.data?.detail?.[0]?.msg
        : res?.response?.data?.message
        ? res?.response?.data?.message
        : res?.response?.data?.error?.message;
    if (error) return error;
  }

  if (res?.data) {
    const error = res?.data?.error?.message;
    if (error) return error;
  }

  return res?.message || defaultMessage;
};

export const stringify = (obj: Object): string => {
  return JSON.stringify(obj, function (key, value) {
    if (value && typeof value === 'object') {
      var replacement: {[key: string]: any} = {};
      for (var k in value) {
        if (Object.hasOwnProperty.call(value, k)) {
          replacement[k && snakeCase(k.toString())] = value[k];
        }
      }
      return replacement;
    }
    return value;
  });
};

import {PermissionsAndroid} from 'react-native';

export const requestMicrophonePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Microphone Permission',
        message: 'This app needs access to your microphone to record audio.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the microphone');
    } else {
      console.log('Microphone permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};
