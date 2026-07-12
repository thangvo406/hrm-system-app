import type { Theme } from '../theme';

import { Image } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { SHARED } from '../theme';

type NotifyBannerProps = {
  readonly subtitle: string;
  readonly theme: Theme;
  readonly title: string;
};

function NotifyBanner({ subtitle, theme, title }: NotifyBannerProps) {
  return (
    <View style={[styles.banner, { backgroundColor: theme.iconBg }]}>
      <View style={styles.iconWrap}>
        <Image
          color={theme.accent}
          height={ScaleSize(32)}
          name={theme.notifyIcon}
          type="svg"
          width={ScaleSize(32)}
        />
      </View>
      <View style={styles.textCol}>
        <Text style={[styles.title, { color: theme.accent }]}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    borderRadius: ScaleSize(12),
    flexDirection: 'row',
    marginHorizontal: ScaleSize(16),
    marginTop: ScaleSize(12),
    padding: ScaleSize(16),
  },
  iconWrap: {
    marginRight: ScaleSize(12),
  },
  subtitle: {
    color: SHARED.textGray,
    fontSize: ScaleSize(13),
    lineHeight: ScaleSize(18),
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: ScaleSize(14),
    fontWeight: '600',
    marginBottom: ScaleSize(2),
  },
});

export default React.memo(NotifyBanner);
