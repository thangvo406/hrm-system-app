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

// Backstop cứng ở tầng RNFS.downloadFile (SDK) — hiếm khi tự nó kích hoạt vì
// CODEPUSH_GATE_DOWNLOAD_STALL_TIMEOUT_MS bên dưới phát hiện đứt kết nối sớm
// hơn nhiều, chỉ giữ lại phòng khi cơ chế đó có bug.
const CODEPUSH_DOWNLOAD_READ_TIMEOUT_MS = 300_000;

// Ngưỡng "im lặng" ở tầng app (CodePushGate): nếu quá thời gian này mà không
// nhận thêm byte nào từ server thì coi như tải hỏng, không phải tổng thời
// gian tải — bundle to hay mạng chậm cỡ nào cũng không sao miễn dữ liệu vẫn
// đang chảy. Xem giải thích ở DEFAULT_DOWNLOAD_STALL_TIMEOUT_MS trong
// useCodePushGate.ts.
const CODEPUSH_GATE_DOWNLOAD_STALL_TIMEOUT_MS = 20_000;

const CODEPUSH_CONFIG: ComponentProps<typeof CodePushProvider>['config'] = {
  checkFrequency: 'ON_APP_START',
  deploymentKeyAndroid: '27ce249f77eaa9ecea20b5bbbd5d9201fe2daa738c5f9778',
  // deploymentKeyIOS: '8412e6b309b4ef558164dd1a5a43e4ccbaf15a864cb99ee6',
  deploymentKeyIOS: 'cc01294c9bd11d1edc6508489f646a0b85b056a788fd7cd7',
  downloadReadTimeoutMs: CODEPUSH_DOWNLOAD_READ_TIMEOUT_MS,
  installMode: 'ON_NEXT_RESTART',
  serverUrl: 'http://192.168.100.104:3000', // KHÔNG có dấu / cuối
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
                downloadStallTimeoutMs={
                  CODEPUSH_GATE_DOWNLOAD_STALL_TIMEOUT_MS
                }
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
