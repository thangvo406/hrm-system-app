import type { ReactotronReactNative } from 'reactotron-react-native';

import Reactotron from 'reactotron-react-native';
import mmkvPlugin from 'reactotron-react-native-mmkv';

import config from '../app.json';
import { createMMKV } from 'react-native-mmkv';
// import { storage } from './App';
const storage = createMMKV();
Reactotron.configure({
  // host: 'localhost',
  host: '192.168.9.37',
  name: config.name,
  port: 9090,
})
  .useReactNative()
  .use(mmkvPlugin<ReactotronReactNative>({ storage }))
  .connect();
