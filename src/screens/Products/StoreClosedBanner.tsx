import type { IStoreItem } from '@type/store';

import { Image } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { CommonUtils } from '@utils';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const BANNER_ICON_SIZE = ScaleSize(18);

type Properties = {
  readonly storeInfo?: IStoreItem;
};

function StoreClosedBanner({ storeInfo = undefined }: Properties) {
  const { t } = useTranslation();

  const reopenText = useMemo(
    () =>
      CommonUtils.getStoreReopenText(
        storeInfo,
        t('products.store_reopen_date_format'),
      ),
    [storeInfo, t],
  );

  return (
    <View style={styles.banner} testID="store-closed-banner">
      <Image
        color={Colors.red03}
        height={BANNER_ICON_SIZE}
        name="ic_store_closed"
        type="svg"
        width={BANNER_ICON_SIZE}
      />
      <Text numberOfLines={2} style={styles.label} testID="store-closed-label">
        {t('products.store_closed')}
        {reopenText ? (
          <Text style={styles.detail}>
            {` · ${t('products.store_reopen_at', { time: reopenText })}`}
          </Text>
        ) : undefined}
      </Text>
    </View>
  );
}

export default React.memo(StoreClosedBanner);

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    backgroundColor: Colors.red02,
    borderTopLeftRadius: ScaleSize(16),
    borderTopRightRadius: ScaleSize(16),
    flexDirection: 'row',
    gap: ScaleSize(8),
    paddingBottom: ScaleSize(20),
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(12),
  },
  detail: {
    color: Colors.red04,
    fontWeight: '400',
  },
  label: {
    color: Colors.red03,
    flex: 1,
    fontSize: ScaleSize(14),
    fontWeight: '700',
  },
});
