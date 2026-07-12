import type { IconName } from '@assets/icons';
import type { Theme } from '../theme';

import { Image } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { SHARED } from '../theme';

type InfoRowProps = {
  readonly children?: React.ReactNode;
  readonly icon: IconName;
  readonly label: string;
  readonly showDivider?: boolean;
  readonly theme: Theme;
  readonly value?: string;
  readonly valueColor?: string;
  readonly valueSize?: number;
};

function InfoRow({
  children = undefined,
  icon,
  label,
  showDivider = true,
  theme,
  value = undefined,
  valueColor = SHARED.textDark,
  valueSize = 14,
}: InfoRowProps) {
  return (
    <View>
      <View style={styles.row}>
        <View style={[styles.iconWrap, { backgroundColor: theme.iconBg }]}>
          <Image
            color={theme.accent}
            height={ScaleSize(22)}
            name={icon}
            type="svg"
            width={ScaleSize(22)}
          />
        </View>
        <View style={styles.textCol}>
          <Text style={styles.label}>{label}</Text>
          {value === undefined ? undefined : (
            <Text
              style={[
                styles.value,
                { color: valueColor, fontSize: ScaleSize(valueSize) },
              ]}
            >
              {value}
            </Text>
          )}
        </View>
        {children}
      </View>
      {showDivider ? <View style={styles.divider} /> : undefined}
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    backgroundColor: SHARED.divider,
    height: 1,
    marginVertical: ScaleSize(2),
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: ScaleSize(20),
    height: ScaleSize(40),
    justifyContent: 'center',
    marginRight: ScaleSize(12),
    width: ScaleSize(40),
  },
  label: {
    color: SHARED.textGray,
    fontSize: ScaleSize(12),
    marginBottom: ScaleSize(2),
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: ScaleSize(12),
  },
  textCol: {
    flex: 1,
  },
  value: {
    fontWeight: '600',
  },
});

export default React.memo(InfoRow);
