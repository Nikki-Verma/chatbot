import {ChatSDK} from './src/ChatSDK';
import {ChatSDKConfig} from './src/types/ChatSDKConfig';

const config: ChatSDKConfig = {
  botName: 'LocalBot',
  botKey: 'local-key',
  endpoint: 'http://localhost:3000/api',
};

const App = () => {
  return ChatSDK.init(config);
};

export default App;
