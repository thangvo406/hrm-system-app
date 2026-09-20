import Image from '@components/Image';
import imageNames from '@assets/images/names';
import React from 'react';
import { Colors } from '@constants';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { ScaleSize } from '@kits/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// The artwork is sized against the screen height rather than its own
// 1228x939 ratio, so the form sheet lands where the design puts it.
const HERO_HEIGHT_RATIO = 0.515;
const HERO_HEIGHT = SCREEN_HEIGHT * HERO_HEIGHT_RATIO;

// ic_logo_login.png is 1462 x 501.
const LOGO_WIDTH = ScaleSize(120);
const LOGO_HEIGHT = ScaleSize(41);

/**
 * Top half of the login screen: the brand mark and welcome message laid over
 * the branded artwork.
 */
function LoginHero() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Image
        height={HERO_HEIGHT}
        name={imageNames.bg_login}
        resizeMode="stretch"
        width={SCREEN_WIDTH}
      />
      <View
        style={[styles.content, { paddingTop: insets.top + ScaleSize(10) }]}
      >
        <Image
          height={LOGO_HEIGHT}
          name={imageNames.ic_logo_login}
          resizeMode="contain"
          width={LOGO_WIDTH}
        />
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
    paddingHorizontal: ScaleSize(30),
  },
  subtitle: {
    color: Colors.gray17,
    fontSize: ScaleSize(16),
    marginTop: ScaleSize(10),
  },
  title: {
    color: Colors.navy02,
    fontSize: ScaleSize(30),
    fontWeight: '800',
    letterSpacing: ScaleSize(-0.5),
    lineHeight: ScaleSize(40),
    marginTop: ScaleSize(36),
    // Keeps the headline clear of the "Good People / Great Workplaces"
    // lettering baked into the artwork on the right.
    maxWidth: ScaleSize(250),
  },
});

export default React.memo(LoginHero);
