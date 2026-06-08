import {
  decrement,
  increment,
} from '@services/slices/counter/counterSlice';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BUTTON_SIZE = 80;

function Example() {
  const dispatch = useAppDispatch();
  const count = useAppSelector((state) => state.counter.value);

  return (
    <SafeAreaView mode="padding" style={styles.container}>
      <StatusBar backgroundColor="#EFEFEF" barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.label}>Counter</Text>
        <Text style={styles.value} testID="counter-value">
          {count}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => {
              dispatch(decrement());
            }}
            style={styles.button}
            testID="decrement-button"
          >
            <Text style={styles.buttonText}>−</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              dispatch(increment());
            }}
            style={[styles.button, styles.buttonPrimary]}
            testID="increment-button"
          >
            <Text style={[styles.buttonText, styles.buttonTextPrimary]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#E1E1EF',
    borderRadius: BUTTON_SIZE / 2,
    height: BUTTON_SIZE,
    justifyContent: 'center',
    width: BUTTON_SIZE,
  },
  buttonPrimary: {
    backgroundColor: '#44427D',
  },
  buttonText: {
    color: '#303030',
    fontSize: 40,
    fontWeight: 'bold',
    lineHeight: 44,
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
  },
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  label: {
    color: '#A1A1A1',
    fontSize: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  value: {
    color: '#303030',
    fontSize: 96,
    fontWeight: 'bold',
    marginVertical: 24,
  },
});

export default Example;
