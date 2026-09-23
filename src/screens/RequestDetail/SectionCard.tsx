import type { IconName } from '@assets/icons';
import type { ReactNode } from 'react';

import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const ICON_SIZE = ScaleSize(18);
const CARD_SHADOW_OFFSET = ScaleSize(4);
const CARD_SHADOW_RADIUS = ScaleSize(10);
const CARD_SHADOW_OPACITY = 0.05;
const CARD_ELEVATION = 2;

type Properties = {
  readonly children: ReactNode;
  readonly icon: IconName;
  /** Chữ nhỏ nép mép phải tiêu đề, ví dụ số tệp đính kèm. */
  readonly sideLabel?: string;
  readonly titleKey: string;
};

/** Vỏ chung của bốn khối trên màn chi tiết: icon + tiêu đề, gạch ngang, nội dung. */
function SectionCard({ children, icon, sideLabel, titleKey }: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          color={Colors.blue02}
          height={ICON_SIZE}
          name={icon}
          type="svg"
          width={ICON_SIZE}
        />
        <Text style={styles.title}>{t(titleKey)}</Text>
        {sideLabel ? (
          <Text style={styles.sideLabel}>{sideLabel}</Text>
        ) : undefined}
      </View>

      <View style={styles.divider} />

      {children}
    </View>
  );
}

export default React.memo(SectionCard);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(16),
    elevation: CARD_ELEVATION,
    padding: ScaleSize(16),
    shadowColor: Colors.navy04,
    shadowOffset: { height: CARD_SHADOW_OFFSET, width: 0 },
    shadowOpacity: CARD_SHADOW_OPACITY,
    shadowRadius: CARD_SHADOW_RADIUS,
  },
  divider: {
    backgroundColor: Colors.gray19,
    height: 1,
    marginBottom: ScaleSize(14),
    marginTop: ScaleSize(12),
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(8),
  },
  sideLabel: {
    color: Colors.gray18,
    flex: 1,
    fontSize: ScaleSize(12),
    textAlign: 'right',
  },
  title: {
    color: Colors.navy04,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
});
