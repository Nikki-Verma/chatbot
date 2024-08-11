/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Buffer } from 'buffer';

global.Buffer = Buffer;

AppRegistry.registerComponent(appName, () => App);
// index.ts
export {ChatSDK} from './src/ChatSDK';
export {ChatSDKConfig} from './src/types/ChatSDKConfig';
