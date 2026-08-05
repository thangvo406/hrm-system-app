import { Image } from '@components';
import { ScaleSize } from '@kits/core';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ACCENT_INK, HAIRLINE } from './tokens';
import { BankUtils } from '@utils';

const THUMBNAIL_SIZE = ScaleSize(46);
const ICON_SIZE = ScaleSize(22);

type Properties = {
  readonly displayName?: string;
};

/**
 * Banks ship no logo assets, so the thumbnail is drawn from the bank name
 * itself — initials, falling back to the generic bank mark.
 */
function BankThumbnail({ displayName }: Properties) {
  const initials = BankUtils.getInitials(displayName);

  return (
    <View style={styles.thumbnail}>
      {initials.length > 0 ? (
        <Text style={styles.initials}>{initials}</Text>
      ) : (
        <Image
          color={ACCENT_INK}
          height={ICON_SIZE}
          name="ic_bank"
          type="svg"
          width={ICON_SIZE}
        />
      )}
    </View>
  );
}

export default React.memo(BankThumbnail);

const styles = StyleSheet.create({
  initials: {
    color: ACCENT_INK,
    fontSize: ScaleSize(15),
    fontWeight: '800',
  },
  thumbnail: {
    alignItems: 'center',
    backgroundColor: '#F4F6F8',
    borderColor: HAIRLINE,
    borderRadius: THUMBNAIL_SIZE / 2,
    borderWidth: ScaleSize(1),
    height: THUMBNAIL_SIZE,
    justifyContent: 'center',
    width: THUMBNAIL_SIZE,
  },
});
