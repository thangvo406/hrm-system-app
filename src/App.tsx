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
import { FileManager } from '@kits/core/utils/FileManager';

void FileManager.checkExistAndCreateLog();

const CODEPUSH_DOWNLOAD_READ_TIMEOUT_MS = 300_000;

const CODEPUSH_GATE_MIN_DOWNLOAD_KBPS = 20;
const CODEPUSH_GATE_DOWNLOAD_TIMEOUT_BUFFER_MS = 30_000;

const CODEPUSH_CONFIG: ComponentProps<typeof CodePushProvider>['config'] = {
  checkFrequency: 'ON_APP_START',
  deploymentKeyAndroid: '7def6cbec16e645b66e54c89a93c16c207d8afc718410ea9',
  deploymentKeyIOS: 'dcef92158de76153296ac18a92ecd2eb290108763ee7ede8',
  downloadReadTimeoutMs: CODEPUSH_DOWNLOAD_READ_TIMEOUT_MS,
  installMode: 'ON_NEXT_RESTART',
  serverUrl: 'https://code-push.allaindev.site', // KHÔNG có dấu / cuối
  // serverUrl: 'http://172.20.10.2:3000', // KHÔNG có dấu / cuối
};

function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <Provider store={store}>
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
              <CodePushGate
                downloadTimeoutBufferMs={
                  CODEPUSH_GATE_DOWNLOAD_TIMEOUT_BUFFER_MS
                }
                minDownloadKbps={CODEPUSH_GATE_MIN_DOWNLOAD_KBPS}
              >
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
