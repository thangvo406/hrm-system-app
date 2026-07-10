import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from '@components';
import { Colors } from '@constants';
import { useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors/account';
import { ScaleSize } from '@kits/core';

type Properties = {
  readonly color: string;
  readonly size: number;
};

const BADGE_SIZE = ScaleSize(19);
const BADGE_FONT_SIZE = ScaleSize(10);

function CartTabIcon({ color, size }: Properties) {
  const count = useAppSelector(AccountSelector.getTotalItemCart);

  return (
    <View style={styles.container}>
      <Image
        color={color}
        height={size}
        name="ic_cart"
        type="svg"
        width={size}
      />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText} numberOfLines={1}>
            {count > 99 ? '99+' : String(count)}
          </Text>
        </View>
      )}
    </View>
  );
}

export default React.memo(CartTabIcon);

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderColor: '#FFFFFF',
    borderRadius: BADGE_SIZE / 2,
    borderWidth: 1.5,
    bottom: 'auto' as any,
    justifyContent: 'center',
    minWidth: BADGE_SIZE,
    height: BADGE_SIZE,
    paddingHorizontal: ScaleSize(3),
    position: 'absolute',
    right: -ScaleSize(6),
    top: -ScaleSize(4),
    zIndex: 1,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: BADGE_FONT_SIZE,
    fontWeight: '700',
    includeFontPadding: false,
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
