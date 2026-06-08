import type { RootScreenProps } from '@navigation/types';

import imageNames from '@assets/images/names';
import Image from '@components/Image';
import { Paths } from '@navigation/paths';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BANNER_HEIGHT = 100;
const BANNER_WIDTH = 200;
const MASCOT_SIZE = 220;

function Welcome({ navigation }: RootScreenProps<Paths.Welcome>) {
  const { t } = useTranslation();

  const goToAuthorise = (isLogin: boolean) => () => {
    navigation.reset({
      index: 0,
      routes: [{ name: Paths.Authorization, params: { isLogin } }],
    });
  };

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

      <View style={styles.actions}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={goToAuthorise(true)}
          style={[styles.button, styles.buttonPrimary]}
          testID="welcome-login-button"
        >
          <Text style={[styles.buttonText, styles.buttonTextPrimary]}>
            {t('welcome.login')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={goToAuthorise(false)}
          style={[styles.button, styles.buttonSecondary]}
          testID="welcome-register-button"
        >
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            {t('welcome.register')}
          </Text>
        </TouchableOpacity>
      </View>
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

export default Welcome;
