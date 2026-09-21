import AppButton from '@components/AppButton';
import images from '@assets/images';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { ScaleSize } from '@kits/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const BACK_BUTTON_SIZE = ScaleSize(40);
const BACK_ICON_SIZE = ScaleSize(20);
const PICK_ICON_SIZE = ScaleSize(16);

type Properties = {
  readonly onGoBack: () => void;
  readonly onPickMonth: () => void;
};

function HistoriesHeader({ onGoBack, onPickMonth }: Properties) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <ImageBackground
      resizeMode="cover"
      source={images.bg_home_header}
      style={[styles.container, { paddingTop: insets.top + ScaleSize(8) }]}
    >
      <AppButton
        onPress={onGoBack}
        style={styles.backButton}
        testID="AttendanceHistoriesBack"
      >
        <Image
          color={Colors.white}
          height={BACK_ICON_SIZE}
          name="ic_arrow_left_gray"
          type="svg"
          width={BACK_ICON_SIZE}
        />
      </AppButton>

      <View style={styles.titleBox}>
        <Text numberOfLines={1} style={styles.title}>
          {t('attendance_histories.title')}
        </Text>
      </View>

      <AppButton
        onPress={onPickMonth}
        style={styles.pickButton}
        testID="AttendanceHistoriesPickMonthHeader"
      >
        <Image
          color={Colors.white}
          height={PICK_ICON_SIZE}
          name="ic_calendar"
          type="svg"
          width={PICK_ICON_SIZE}
        />
        <Text numberOfLines={1} style={styles.pickLabel}>
          {t('attendance_histories.pick_month')}
        </Text>
      </AppButton>
    </ImageBackground>
  );
}

export default React.memo(HistoriesHeader);

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
    alignItems: 'center',
    // Nền dự phòng cho khung hình đầu tiên, trước khi ảnh kịp decode.
    backgroundColor: Colors.navy05,
    flexDirection: 'row',
    paddingBottom: ScaleSize(28),
    paddingHorizontal: ScaleSize(16),
  },
  pickButton: {
    alignItems: 'center',
    backgroundColor: Colors.navy06,
    borderRadius: ScaleSize(12),
    flexDirection: 'row',
    gap: ScaleSize(6),
    height: BACK_BUTTON_SIZE,
    paddingHorizontal: ScaleSize(12),
  },
  pickLabel: {
    color: Colors.white,
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
  title: {
    color: Colors.white,
    fontSize: ScaleSize(19),
    fontWeight: '700',
    textAlign: 'center',
  },
  // Tiêu đề canh giữa dải chứ không giữa khoảng trống còn lại: hai nút hai bên
  // rộng khác nhau nên nếu để `flex: 1` thì chữ lệch sang trái.
  titleBox: {
    flex: 1,
    paddingHorizontal: ScaleSize(8),
  },
});
