import 'react-native-gesture-handler';
import '@translations';

import ApplicationNavigator from '@navigation/Application';
import { persistor, store } from '@services/common/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

function App() {
  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <ApplicationNavigator />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
