import Image from '@components/Image';
import imageNames from '@assets/images/names';
import React from 'react';
import { Colors } from '@constants';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { ScaleSize } from '@kits/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

// bg_login.png is 1228 x 939; keeping its ratio avoids stretching the artwork.
const BACKGROUND_RATIO = 1228 / 939;
const SCREEN_WIDTH = Dimensions.get('window').width;
const HERO_HEIGHT = SCREEN_WIDTH / BACKGROUND_RATIO;

/**
 * Top half of the login screen: the branded artwork with the welcome message
 * laid over its empty upper-left corner.
 */
function LoginHero() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Image
        height={HERO_HEIGHT}
        name={imageNames.bg_login}
        resizeMode="cover"
        width={SCREEN_WIDTH}
      />
      <View
        style={[styles.content, { paddingTop: insets.top + ScaleSize(28) }]}
      >
        <Text style={styles.title}>{t('authorisation.welcome_title')}</Text>
        <Text style={styles.subtitle}>
          {t('authorisation.welcome_subtitle')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    height: HERO_HEIGHT,
    width: SCREEN_WIDTH,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: ScaleSize(24),
  },
  subtitle: {
    color: Colors.gray17,
    fontSize: ScaleSize(15),
    marginTop: ScaleSize(6),
  },
  title: {
    color: Colors.navy02,
    fontSize: ScaleSize(28),
    fontWeight: '700',
    letterSpacing: ScaleSize(-0.5),
  },
});

export default React.memo(LoginHero);
