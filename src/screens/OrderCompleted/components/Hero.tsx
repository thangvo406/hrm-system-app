import type { Theme } from '../theme';

import { Image } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { SHARED } from '../theme';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@utils/product';

type ConfettiSpec = {
  readonly colorIndex: 0 | 1 | 2;
  readonly height: number;
  readonly id: number;
  readonly rotation: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
};

const CONFETTI: readonly ConfettiSpec[] = [
  { colorIndex: 2, height: 8, id: 1, rotation: -30, width: 6, x: 30, y: 60 },
  { colorIndex: 0, height: 6, id: 2, rotation: 15, width: 10, x: 55, y: 110 },
  { colorIndex: 1, height: 8, id: 3, rotation: -45, width: 6, x: 68, y: 160 },
  { colorIndex: 0, height: 10, id: 4, rotation: 20, width: 6, x: 310, y: 55 },
  { colorIndex: 2, height: 6, id: 5, rotation: -20, width: 10, x: 285, y: 100 },
  { colorIndex: 1, height: 8, id: 6, rotation: 40, width: 6, x: 315, y: 150 },
  { colorIndex: 2, height: 6, id: 7, rotation: -10, width: 10, x: 100, y: 155 },
  { colorIndex: 0, height: 8, id: 8, rotation: 55, width: 6, x: 250, y: 45 },
];

const HERO_CIRCLE = 110;
const CONFETTI_RADIUS = 2;

type HeroProps = {
  readonly paddingTop: number;
  readonly totalAmount?: number;
  readonly subtitle: string;
  readonly theme: Theme;
  readonly title: string;
};

function Hero({ paddingTop, totalAmount, subtitle, theme, title }: HeroProps) {
  const { t } = useTranslation();
  return (
    <View style={[styles.hero, { paddingTop }]}>
      {CONFETTI.map(item => (
        <View
          key={item.id}
          style={{
            height: item.height + 4,
            left: item.x,
            position: 'absolute',
            top: item.y,
            width: item.width + 4,
          }}
        >
          <View
            style={{
              backgroundColor: theme.confetti[item.colorIndex],
              borderRadius: CONFETTI_RADIUS,
              height: item.height,
              transform: [{ rotate: `${item.rotation}deg` }],
              width: item.width,
            }}
          />
        </View>
      ))}
      <View style={[styles.circle, { backgroundColor: theme.heroCircleBg }]}>
        <Image
          color={theme.accent}
          height={ScaleSize(HERO_CIRCLE)}
          name={theme.heroIcon}
          type="svg"
          width={ScaleSize(HERO_CIRCLE)}
        />
      </View>
      <Text style={[styles.title, { color: theme.titleColor }]}>
        {t('order_completed.display_price', {
          amount: formatCurrency(totalAmount),
        })}
      </Text>
      <Text style={[styles.title, { color: theme.titleColor }]}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    borderRadius: 60,
    height: ScaleSize(HERO_CIRCLE),
    justifyContent: 'center',
    marginBottom: ScaleSize(20),
    width: ScaleSize(HERO_CIRCLE),
  },
  hero: {
    alignItems: 'center',
    paddingBottom: ScaleSize(24),
    paddingTop: ScaleSize(32),
  },
  subtitle: {
    color: SHARED.textGray,
    fontSize: ScaleSize(14),
    lineHeight: ScaleSize(22),
    marginTop: ScaleSize(8),
    textAlign: 'center',
  },
  title: {
    fontSize: ScaleSize(24),
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default React.memo(Hero);
