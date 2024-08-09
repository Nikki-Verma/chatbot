// App.tsx

import theme from '@/_utils/theme.antd';
import {Provider} from '@ant-design/react-native';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import ChatSDK from './src/components/ChatSDK';

const App: React.FC = () => {
  const chatConfig = {
    buttonText: 'Start Chat',
  };

  return (
    <Provider theme={{...theme}}>
      <View style={styles.container}>
        <ChatSDK config={chatConfig} />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
