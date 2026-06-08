import type { RootScreenProps } from '@navigation/types';

import Image from '@components/Image';
import { Paths } from '@navigation/paths';
import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function Startup({ navigation }: RootScreenProps<Paths.Startup>) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: Paths.Welcome }],
      });
    }, 1500);
    return () => {
      clearTimeout(timer);
    };
  }, [navigation]);

  return (
    <SafeAreaView mode="padding" style={styles.container}>
      <Image height={300} name="tom" width={300} />
      <Text style={styles.text}>Loading…</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: '#A1A1A1',
    fontSize: 16,
    marginTop: 24,
  },
});

export default Startup;
