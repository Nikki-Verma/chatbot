import {ChatSDKConfig} from '@/types/ChatSDKConfig';
import {Provider as AntdProvider} from '@ant-design/react-native';
import React, {createContext, ReactNode, useContext, useState} from 'react';

interface ChatSDKContextProps {
  chatbotConfig: ChatSDKConfig | null;
  setChatbotConfig: (config: ChatSDKConfig) => void;
}

const ChatSDKContext = createContext<ChatSDKContextProps | undefined>(
  undefined,
);

export const ChatSDKProvider = ({children}: {children: ReactNode}) => {
  const [chatbotConfig, setChatbotConfig] = useState<ChatSDKConfig | null>(
    null,
  );

  return (
    <ChatSDKContext.Provider value={{chatbotConfig, setChatbotConfig}}>
      <AntdProvider
        theme={{brand_primary: '#602EDF', primary_button_fill: '#602EDF'}}>
        {children}
      </AntdProvider>
    </ChatSDKContext.Provider>
  );
};

export const useChatSDK = () => {
  const context = useContext(ChatSDKContext);
  if (!context) {
    throw new Error('useChatSDK must be used within a ChatSDKProvider');
  }
  return context;
};
