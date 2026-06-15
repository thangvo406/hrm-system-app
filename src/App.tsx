import 'react-native-gesture-handler';
import '@translations';

import ApplicationNavigator from '@navigation/Application';
import { persistor, store } from '@services/common/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Dialog from '@screens/Dialog';
import AppNavigator from '@navigation/AppNavigator';
import { StatusBar } from 'react-native';

function App() {
  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <SafeAreaProvider>
          <PersistGate persistor={persistor}>
            <StatusBar
              backgroundColor="transparent"
              barStyle="dark-content"
              translucent
            />
            <ApplicationNavigator />
            <Dialog ref={ref => AppNavigator.setRefDialog(ref)} />
          </PersistGate>
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
