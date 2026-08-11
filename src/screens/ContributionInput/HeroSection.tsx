import { Image } from '@components';
import { ScaleSize } from '@kits/core';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { LeafBackdrop } from './icons';
import imageNames from '@assets/images/names';

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#5B6058';
const ILLUSTRATION_WIDTH = ScaleSize(160);
const ILLUSTRATION_HEIGHT = ScaleSize(128);

type Properties = {
  readonly subtitle: string;
  readonly title: string;
};

function HeroSection({ subtitle, title }: Properties) {
  return (
    <View style={styles.container}>
      <LeafBackdrop />
      <Text style={styles.title}>{title}</Text>
      <View style={styles.row}>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={styles.illustration}>
          <Image
            height={ILLUSTRATION_HEIGHT}
            name={imageNames.ic_coin_stack}
            width={ILLUSTRATION_WIDTH}
          />
        </View>
      </View>
    </View>
  );
}

export default React.memo(HeroSection);

const styles = StyleSheet.create({
  container: {
    paddingBottom: ScaleSize(8),
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(5),
  },
  illustration: {
    marginRight: -ScaleSize(4),
    marginTop: -ScaleSize(34),
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ScaleSize(14),
  },
  subtitle: {
    color: TEXT_MUTED,
    flex: 1,
    fontSize: ScaleSize(14),
    lineHeight: ScaleSize(22),
    marginRight: ScaleSize(8),
  },
  title: {
    color: TEXT_DARK,
    fontSize: ScaleSize(30),
    fontWeight: '800',
    letterSpacing: -ScaleSize(0.5),
  },
});
