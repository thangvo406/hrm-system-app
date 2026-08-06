import type { IconName } from '@assets/icons';

import { Colors } from '@constants';
import { Image } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { SECTION_ICON_SIZE, sharedStyles } from './theme';

type Properties = {
  readonly children: React.ReactNode;
  readonly iconName: IconName;
  readonly title: string;
};

const ICON_SIZE = ScaleSize(22);

function SectionCard({ children, iconName, title }: Properties) {
  return (
    <View style={sharedStyles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Image
            color={Colors.primary}
            height={ICON_SIZE}
            name={iconName}
            type="svg"
            width={ICON_SIZE}
          />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

export default React.memo(SectionCard);

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(10),
    marginBottom: ScaleSize(14),
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: Colors.green09,
    borderRadius: ScaleSize(12),
    height: SECTION_ICON_SIZE,
    justifyContent: 'center',
    width: SECTION_ICON_SIZE,
  },
  title: {
    color: Colors.black01,
    fontSize: ScaleSize(15),
    fontWeight: '600',
  },
});
