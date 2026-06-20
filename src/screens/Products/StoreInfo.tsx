import { Image } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { StoreItem } from '@type/store';

const CLOCK_ICON_SIZE = ScaleSize(16);

const TEXT_DARK = '#1A1A1A';

function StoreInfo({ storeInfo = undefined }: { readonly storeInfo?: StoreItem }) {
  return (
    <View style={styles.storeInfo}>
      <Text style={styles.storeName}>{storeInfo?.name}</Text>
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Image
            color={TEXT_DARK}
            height={CLOCK_ICON_SIZE}
            name="ic_clock"
            type="svg"
            width={CLOCK_ICON_SIZE}
          />
          <Text style={styles.metaText}>{storeInfo?.estimateTime}</Text>
        </View>
        <Text style={styles.metaText}>{storeInfo?.minOrder}</Text>
      </View>
    </View>
  );
}

export default React.memo(StoreInfo);

const styles = StyleSheet.create({
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(6),
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(20),
    marginTop: ScaleSize(12),
  },
  metaText: {
    color: TEXT_DARK,
    fontSize: ScaleSize(13),
  },
  storeInfo: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(20),
    paddingBottom: ScaleSize(20),
  },
  storeName: {
    color: TEXT_DARK,
    fontSize: ScaleSize(24),
    fontWeight: '800',
  },
});
