import 'react-native-gesture-handler';
import '@translations';

import type { ComponentProps } from 'react';

import ApplicationNavigator from '@navigation/Application';
import { persistor, store } from '@services/common/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CodePushGate from '@components/CodePushGate';
import Dialog from '@screens/Dialog';
import AppNavigator from '@navigation/AppNavigator';
import { StatusBar, StyleSheet } from 'react-native';
import { CodePushProvider } from 'react-native-codepush-sdk';

const CODEPUSH_CONFIG: ComponentProps<typeof CodePushProvider>['config'] = {
  checkFrequency: 'ON_APP_START',
  deploymentKeyAndroid: '27ce249f77eaa9ecea20b5bbbd5d9201fe2daa738c5f9778',
  deploymentKeyIOS: '8412e6b309b4ef558164dd1a5a43e4ccbaf15a864cb99ee6',
  installMode: 'ON_NEXT_RESTART',
  serverUrl: 'http://192.168.68.111:3000', // KHÔNG có dấu / cuối
};

function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <Provider store={store}>
        {/* autoCheck/checkOnResume tắt vì CodePushGate tự điều khiển toàn bộ
            luồng check -> download -> install. Bật lên sẽ có hai
            checkForUpdate chạy chồng nhau và SDK throw 'Already checking for
            update'. */}
        <CodePushProvider
          autoCheck={false}
          checkOnResume={false}
          config={CODEPUSH_CONFIG}
        >
          <PersistGate persistor={persistor}>
            <SafeAreaProvider>
              <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent
              />
              <CodePushGate>
                <ApplicationNavigator />
                <Dialog ref={ref => AppNavigator.setRefDialog(ref)} />
              </CodePushGate>
            </SafeAreaProvider>
          </PersistGate>
        </CodePushProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
