import { Button } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { DeviceUtils } from '@kits/core/utils';
import React from 'react';

const { ifAndroid } = DeviceUtils;

type Properties = {
  readonly onPressContactSupport: () => void;
  readonly onPressReorder: () => void;
};

const ANDROID_BOTTOM_SPACE = 16;

function BottomActions({ onPressContactSupport, onPressReorder }: Properties) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: ifAndroid(
            ANDROID_BOTTOM_SPACE,
            insets.bottom + ScaleSize(8),
          ),
        },
      ]}
    >
      <Button
        onPress={onPressReorder}
        style={styles.action}
        testID="order-detail-reorder"
        title={t('order_history_detail.reorder')}
        type="outline-bordered"
      />
      <Button
        onPress={onPressContactSupport}
        style={styles.action}
        testID="order-detail-support"
        title={t('order_history_detail.contact_support')}
        type="rounded"
      />
    </View>
  );
}

export default React.memo(BottomActions);

const styles = StyleSheet.create({
  action: {
    flex: 1,
  },
  bar: {
    backgroundColor: Colors.white,
    borderTopColor: Colors.gray19,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: ScaleSize(10),
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(10),
  },
});
