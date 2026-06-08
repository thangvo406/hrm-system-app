import '@translations';

import { store } from '@services/common/store';
import { type PropsWithChildren } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

function TestAppWrapper({ children }: PropsWithChildren) {
  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <SafeAreaProvider>{children}</SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default TestAppWrapper;
