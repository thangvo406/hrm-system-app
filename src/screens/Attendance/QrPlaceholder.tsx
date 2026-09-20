import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const FRAME_SIZE = ScaleSize(170);
const FRAME_ICON_SIZE = ScaleSize(44);
const FRAME_BORDER_WIDTH = 2;

/**
 * Chỗ dành sẵn cho luồng quét mã QR. Chưa gắn camera: việc đó cần thêm một thư
 * viện native (vision-camera hoặc tương đương) mà repo chưa có.
 */
function QrPlaceholder() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <Image
          color={Colors.gray24}
          height={FRAME_ICON_SIZE}
          name="ic_qr_scan"
          type="svg"
          width={FRAME_ICON_SIZE}
        />
      </View>
      <Text style={styles.label}>{t('attendance.qr_coming_soon')}</Text>
    </View>
  );
}

export default React.memo(QrPlaceholder);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(18),
    marginHorizontal: ScaleSize(16),
    marginTop: ScaleSize(16),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(20),
  },
  frame: {
    alignItems: 'center',
    borderColor: Colors.gray19,
    borderRadius: ScaleSize(18),
    borderStyle: 'dashed',
    borderWidth: FRAME_BORDER_WIDTH,
    height: FRAME_SIZE,
    justifyContent: 'center',
    width: FRAME_SIZE,
  },
  label: {
    color: Colors.gray24,
    fontSize: ScaleSize(14),
    marginTop: ScaleSize(14),
    textAlign: 'center',
  },
});
