
import CryptoJS from 'crypto-js';

export const encryptData = (data: string, key: string): string => {
  const truncatedKey = CryptoJS.enc.Utf8.parse(key.slice(0, 16));
  const encrypted = CryptoJS.AES.encrypt(data, truncatedKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

export const getErrorFromApi = (
    res:any,
    defaultMessage: any = "Something went wrong!",
  ) => {
    if (typeof res === "string") {
      return res;
    }
    if (res?.response) {
      const error =
        res?.response?.data?.detail &&
        typeof res?.response?.data?.detail === "string"
          ? res?.response?.data?.detail
          : res?.response?.data?.detail?.[0]?.msg &&
            typeof res?.response?.data?.detail?.[0]?.msg === "string"
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