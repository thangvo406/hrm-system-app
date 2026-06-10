import { AppRegistry, Platform } from 'react-native';

import { name as appName } from './app.json';
import App from './src/App';

if (__DEV__ && Platform.OS == 'android') {
  void import('./src/reactotron.config');
}

AppRegistry.registerComponent(appName, () => App);
