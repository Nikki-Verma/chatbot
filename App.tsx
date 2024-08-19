import {ChatSDK} from './src/ChatSDK';
import {ChatSDKConfig} from './src/types/ChatSDKConfig';
import 'react-native-get-random-values';

const config: ChatSDKConfig = {
  TENANT_ID: '1',
  TOKEN: 'bae25696-9938-4715-b038-6100c575263c',
  APP_ID: 'agent-669176ac755a3113eeb6b48e',
};

const App = () => {
  return ChatSDK.init(config);
};

export default App;
