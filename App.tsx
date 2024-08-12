import {ChatSDK} from './src/ChatSDK';
import {ChatSDKConfig} from './src/types/ChatSDKConfig';
import 'react-native-get-random-values';

const config: ChatSDKConfig = {
  TENANT_ID: '1',
  TOKEN: '162cec30-f715-4e79-a883-069273dd1e8b',
  APP_ID: 'pipeline-66a7da50ef61086f23221acb',
};

const App = () => {
  return ChatSDK.init(config);
};

export default App;
