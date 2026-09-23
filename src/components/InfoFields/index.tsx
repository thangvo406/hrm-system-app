import type { TInfoFieldBadge, TProfileInfoField } from '@type/profile';

import Image from '../Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const ICON_SIZE = ScaleSize(20);

/** Nền và màu chữ của viên nhãn, theo ý nghĩa chứ không theo tên màu. */
const BADGE_TONES: Record<
  TInfoFieldBadge,
  { readonly background: string; readonly foreground: string }
> = {
  danger: { background: Colors.red02, foreground: Colors.red03 },
  neutral: { background: Colors.gray21, foreground: Colors.gray17 },
  success: { background: Colors.green13, foreground: Colors.green12 },
  warning: { background: Colors.yellow06, foreground: Colors.yellow03 },
};

type Properties = {
  readonly fields: readonly TProfileInfoField[];
};

function InfoFields({ fields }: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {fields.map(field => {
        const tone = field.badge ? BADGE_TONES[field.badge] : undefined;

        return (
          <View key={field.id} style={styles.field}>
            <Image
              color={Colors.gray17}
              height={ICON_SIZE}
              name={field.icon}
              type="svg"
              width={ICON_SIZE}
            />

            <View style={styles.content}>
              <Text style={styles.label}>{t(field.labelKey)}</Text>

              {tone ? (
                <View
                  style={[styles.badge, { backgroundColor: tone.background }]}
                >
                  <Text style={[styles.badgeLabel, { color: tone.foreground }]}>
                    {field.value}
                  </Text>
                </View>
              ) : (
                <Text style={styles.value}>{field.value}</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default React.memo(InfoFields);

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: ScaleSize(8),
    marginTop: ScaleSize(5),
    paddingHorizontal: ScaleSize(10),
    paddingVertical: ScaleSize(5),
  },
  badgeLabel: {
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
  container: {
    gap: ScaleSize(18),
  },
  content: {
    flex: 1,
  },
  field: {
    flexDirection: 'row',
    gap: ScaleSize(12),
  },
  label: {
    color: Colors.gray18,
    fontSize: ScaleSize(13),
  },
  value: {
    color: Colors.navy04,
    fontSize: ScaleSize(15),
    fontWeight: '600',
    lineHeight: ScaleSize(21),
    marginTop: ScaleSize(3),
  },
});
