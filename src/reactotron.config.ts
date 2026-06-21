import type { ReactotronReactNative } from 'reactotron-react-native';

import Reactotron, { reactNativeCorePlugins } from 'reactotron-react-native';
import mmkvPlugin from 'reactotron-react-native-mmkv';
import { reactotronRedux } from 'reactotron-redux';
import config from '../app.json';

import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV();
const reduxPlugin = reactotronRedux();

const reactotron = Reactotron.configure({
  host: 'localhost',
  name: config.name,
  port: 9090,
})
  .useReactNative(reactNativeCorePlugins as never)
  .use(mmkvPlugin<ReactotronReactNative>({ storage }))
  .use(reduxPlugin)
  .connect();

export const reactotronReduxEnhancer =
  reactotron.createEnhancer?.() ?? undefined;

export default reactotron;
