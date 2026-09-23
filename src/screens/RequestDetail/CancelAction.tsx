import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const ICON_SIZE = ScaleSize(20);

type Properties = {
  readonly onCancel: () => void;
};

/**
 * Thanh huỷ đơn ở đáy màn. Chỉ dựng khi đơn còn rút lại được — xem
 * `REQUEST_STATUS_VIEWS.showCancel`.
 */
function CancelAction({ onCancel }: Properties) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom || ScaleSize(16) },
      ]}
    >
      <AppButton
        onPress={onCancel}
        style={styles.button}
        testID="RequestDetailCancel"
      >
        <Image
          color={Colors.red03}
          height={ICON_SIZE}
          name="ic_trash"
          type="svg"
          width={ICON_SIZE}
        />
        <Text style={styles.label}>{t('request_detail.cancel')}</Text>
      </AppButton>
    </View>
  );
}

export default React.memo(CancelAction);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    // Nền hồng nhạt thay vì đỏ đặc: đây là hành động phá huỷ nhưng không phải
    // hành động chính của màn, không nên hút mắt hơn phần nội dung.
    backgroundColor: Colors.red02,
    borderColor: Colors.red03,
    borderRadius: ScaleSize(14),
    borderWidth: 1,
    flexDirection: 'row',
    gap: ScaleSize(10),
    justifyContent: 'center',
    paddingVertical: ScaleSize(16),
  },
  container: {
    backgroundColor: Colors.white,
    borderTopColor: Colors.gray19,
    borderTopWidth: 1,
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(12),
  },
  label: {
    color: Colors.red03,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
});
