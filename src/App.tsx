import 'react-native-gesture-handler';
import '@translations';

import type { ComponentProps } from 'react';

import ApplicationNavigator from '@navigation/Application';
import { persistor, store } from '@services/common/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Dialog from '@screens/Dialog';
import AppNavigator from '@navigation/AppNavigator';
import { StatusBar, StyleSheet } from 'react-native';
import { CodePushProvider, useCodePush } from 'react-native-codepush-sdk';
import { useEffect } from 'react';

const CODEPUSH_CONFIG: ComponentProps<typeof CodePushProvider>['config'] = {
  checkFrequency: 'ON_APP_START',
  deploymentKeyAndroid: '<key android lấy ở bước 2>',
  deploymentKeyIOS: '9a6bd7c55cc797aee58072968cc79e0bf868440ff7a1be08',
  installMode: 'ON_NEXT_RESTART',
  serverUrl: 'http://192.168.68.112:3000', // KHÔNG có dấu / cuối
};

// Tải + cài update ngầm khi provider check thấy bản mới; bundle được áp dụng ở
// lần mở app kế tiếp (ON_NEXT_RESTART) nên không chặn init route lúc startup.
function CodePushSilentSync() {
  const { availableUpdate, syncUpdate } = useCodePush();

  useEffect(() => {
    if (availableUpdate) {
      void syncUpdate();
    }
  }, [availableUpdate, syncUpdate]);

  return undefined;
}

function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <CodePushProvider autoCheck checkOnResume config={CODEPUSH_CONFIG}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <SafeAreaProvider>
              <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent
              />
              <ApplicationNavigator />
              <Dialog ref={ref => AppNavigator.setRefDialog(ref)} />
              <CodePushSilentSync />
            </SafeAreaProvider>
          </PersistGate>
        </Provider>
      </CodePushProvider>
    </GestureHandlerRootView>
  );
}

export default App;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
