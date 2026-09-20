import type { TAttendanceMode } from '@type/attendance';

import AppButton from '@components/AppButton';
import images from '@assets/images';
import Image from '@components/Image';
import ModeTabs from './ModeTabs';
import React from 'react';
import { Colors } from '@constants';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { ScaleSize } from '@kits/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const BACK_BUTTON_SIZE = ScaleSize(40);
const BACK_ICON_SIZE = ScaleSize(20);
const HISTORY_ICON_SIZE = ScaleSize(16);

type Properties = {
  readonly mode: TAttendanceMode;
  readonly onChangeMode: (mode: TAttendanceMode) => void;
  readonly onGoBack: () => void;
  readonly onPressHistory: () => void;
};

/**
 * Dải navy đầu màn: nút quay lại, tiêu đề, nút Lịch sử và bộ chuyển GPS / QR.
 *
 * Dùng `ImageBackground` của React Native chứ không phải `<Image />` dùng chung:
 * ảnh nền ở đây bọc nội dung nên cần một component nhận children, và vì cả dải
 * nằm gọn trong MỘT view nên không phải đo chiều cao như header màn Trang chủ.
 */
function AttendanceHeader({
  mode,
  onChangeMode,
  onGoBack,
  onPressHistory,
}: Properties) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <ImageBackground
      resizeMode="cover"
      source={images.bg_home_header}
      style={[styles.container, { paddingTop: insets.top + ScaleSize(8) }]}
    >
      <View style={styles.titleRow}>
        <AppButton
          onPress={onGoBack}
          style={styles.backButton}
          testID="AttendanceBack"
        >
          <Image
            color={Colors.white}
            height={BACK_ICON_SIZE}
            name="ic_arrow_left_gray"
            type="svg"
            width={BACK_ICON_SIZE}
          />
        </AppButton>

        <Text style={styles.title}>{t('attendance.title')}</Text>

        <AppButton
          onPress={onPressHistory}
          style={styles.historyButton}
          testID="AttendanceHistory"
        >
          <Image
            color={Colors.white}
            height={HISTORY_ICON_SIZE}
            name="ic_clock"
            type="svg"
            width={HISTORY_ICON_SIZE}
          />
          <Text style={styles.historyLabel}>{t('attendance.history')}</Text>
        </AppButton>
      </View>

      <ModeTabs mode={mode} onChangeMode={onChangeMode} />
    </ImageBackground>
  );
}

export default React.memo(AttendanceHeader);

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    backgroundColor: Colors.navy06,
    borderRadius: ScaleSize(12),
    height: BACK_BUTTON_SIZE,
    justifyContent: 'center',
    width: BACK_BUTTON_SIZE,
  },
  container: {
    // Nền dự phòng cho khung hình đầu tiên, trước khi ảnh kịp decode.
    backgroundColor: Colors.navy05,
    paddingBottom: ScaleSize(16),
    paddingHorizontal: ScaleSize(16),
  },
  historyButton: {
    alignItems: 'center',
    backgroundColor: Colors.navy06,
    borderRadius: ScaleSize(18),
    flexDirection: 'row',
    gap: ScaleSize(6),
    paddingHorizontal: ScaleSize(12),
    paddingVertical: ScaleSize(8),
  },
  historyLabel: {
    color: Colors.white,
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
  title: {
    color: Colors.white,
    flex: 1,
    fontSize: ScaleSize(19),
    fontWeight: '700',
    marginLeft: ScaleSize(12),
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
