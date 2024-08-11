import {ChatSDK} from './src/ChatSDK';
import {ChatSDKConfig} from './src/types/ChatSDKConfig';
import 'react-native-get-random-values';

const config: ChatSDKConfig = {
  TENANT_ID: '1',
  TOKEN: '9097f6a0-0f74-40ea-9bce-545ef26ae845',
  APP_ID: 'pipeline-668ea772b6a0726f4d1cced3',
};

const App = () => {
  return ChatSDK.init(config);
};

export default App;
