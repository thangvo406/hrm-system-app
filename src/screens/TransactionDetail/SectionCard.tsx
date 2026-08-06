import type { IconName } from '@assets/icons';

import { Colors } from '@constants';
import { Image } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

type Properties = {
  readonly badge?: string;
  readonly children: React.ReactNode;
  readonly icon?: IconName;
  readonly title: string;
};

const ICON_SIZE = 20;

function SectionCard({
  badge = undefined,
  children,
  icon = undefined,
  title,
}: Properties) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          {icon ? (
            <Image
              color={Colors.green02}
              height={ScaleSize(ICON_SIZE)}
              name={icon}
              type="svg"
              width={ScaleSize(ICON_SIZE)}
            />
          ) : (
            <View style={styles.ring}>
              <Text style={styles.ringText}>{badge}</Text>
            </View>
          )}
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

export default React.memo(SectionCard);

const styles = StyleSheet.create({
  card: {
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(16),
    marginHorizontal: ScaleSize(16),
    paddingBottom: ScaleSize(8),
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(16),
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: ScaleSize(4),
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: Colors.green05,
    borderRadius: ScaleSize(18),
    height: ScaleSize(36),
    justifyContent: 'center',
    marginRight: ScaleSize(10),
    width: ScaleSize(36),
  },
  ring: {
    alignItems: 'center',
    borderColor: Colors.green02,
    borderRadius: ScaleSize(11),
    borderWidth: 1,
    height: ScaleSize(22),
    justifyContent: 'center',
    width: ScaleSize(22),
  },
  ringText: {
    color: Colors.green02,
    fontSize: ScaleSize(12),
    fontWeight: '700',
  },
  title: {
    color: Colors.black01,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
});
