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

FileManager.checkExistAndCreateLog();

// Backstop cứng ở tầng RNFS.downloadFile (SDK). react-native-fs trên iOS chỉ
// bắn progress event qua self.bridge, mà app chạy New Architecture
// (bridgeless) nên self.bridge luôn nil — progress không bao giờ tới JS dù
// tải vẫn khỏe mạnh (đã xác nhận qua log thực tế). Vì vậy KHÔNG dùng timeout
// kiểu "im lặng thì fail" ở tầng app nữa — xem CODEPUSH_GATE_MIN_DOWNLOAD_KBPS.
const CODEPUSH_DOWNLOAD_READ_TIMEOUT_MS = 300_000;

// Timeout tải bundle ở tầng app (CodePushGate) tính theo packageSize thay vì
// một tổng thời gian cố định: (packageSize / minKbps) + buffer. Xem
// getDownloadTimeoutMs trong useCodePushGate.ts.
const CODEPUSH_GATE_MIN_DOWNLOAD_KBPS = 20;
const CODEPUSH_GATE_DOWNLOAD_TIMEOUT_BUFFER_MS = 30_000;

const CODEPUSH_CONFIG: ComponentProps<typeof CodePushProvider>['config'] = {
  checkFrequency: 'ON_APP_START',
  deploymentKeyAndroid: '27ce249f77eaa9ecea20b5bbbd5d9201fe2daa738c5f9778',
  // deploymentKeyIOS: '8412e6b309b4ef558164dd1a5a43e4ccbaf15a864cb99ee6',
  deploymentKeyIOS: 'cc01294c9bd11d1edc6508489f646a0b85b056a788fd7cd7',
  downloadReadTimeoutMs: CODEPUSH_DOWNLOAD_READ_TIMEOUT_MS,
  installMode: 'ON_NEXT_RESTART',
  serverUrl: 'http://192.168.100.104:3000', // KHÔNG có dấu / cuối
  // serverUrl: 'http://172.20.10.2:3000', // KHÔNG có dấu / cuối
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
