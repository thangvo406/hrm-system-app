import type { ReactotronReactNative } from 'reactotron-react-native';

import Reactotron, { reactNativeCorePlugins } from 'reactotron-react-native';
import mmkvPlugin from 'reactotron-react-native-mmkv';
import { reactotronRedux } from 'reactotron-redux';
import Config from 'react-native-config';

import { storage } from './storage';

const reduxPlugin = reactotronRedux();

const reactotron = Reactotron.configure({
  host: Config.DEV_HOST ?? 'localhost',
  name: 'CoopUse',
  port: 9090,
})
  .useReactNative(reactNativeCorePlugins as never)
  .use(mmkvPlugin<ReactotronReactNative>({ storage }))
  .use(reduxPlugin)
  .connect();

export const reactotronReduxEnhancer =
  reactotron.createEnhancer?.() ?? undefined;

export default reactotron;
