import 'react-native-gesture-handler';
import '@translations';

import ApplicationNavigator from '@navigation/Application';
import { persistor, store } from '@services/common/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <SafeAreaProvider>
          <PersistGate persistor={persistor}>
            <ApplicationNavigator />
          </PersistGate>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
