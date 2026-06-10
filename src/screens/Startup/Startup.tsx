import type { RootScreenProps } from '@navigation/types';

import Image from '@components/Image';
import { Paths } from '@navigation/paths';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import FastImage from '@d11/react-native-fast-image';
import imageNames from '@assets/images/names';

const BANNER_HEIGHT = 100;
const BANNER_WIDTH = 200;
const MASCOT_SIZE = 220;

function Startup({ navigation }: RootScreenProps<Paths.Startup>) {
  useEffect(() => {
    // FastImage.clearDiskCache().then(() => null);
    // FastImage.clearMemoryCache().then(() => null);
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
    <View style={styles.container}>
      <Image
        height={BANNER_HEIGHT}
        name={imageNames.ic_logo_banner}
        width={BANNER_WIDTH}
      />
      <Image
        height={MASCOT_SIZE}
        name={imageNames.ic_logo_welcome}
        style={styles.mascot}
        width={MASCOT_SIZE}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 16,
    // paddingBottom: 68,
    paddingHorizontal: 24,
    marginTop: 50,
    width: '90%',
  },
  button: {
    alignItems: 'center',
    borderRadius: 12,
    elevation: 4,
    height: 56,
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  buttonPrimary: {
    backgroundColor: '#5BB85C',
  },
  buttonSecondary: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextPrimary: {
    color: '#FFFFFF',
  },
  buttonTextSecondary: {
    color: '#303030',
  },
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    paddingTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    // flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
  },
  mascot: {
    marginTop: 40,
  },
});

export default Startup;
