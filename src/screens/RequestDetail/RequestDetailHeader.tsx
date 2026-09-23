import AppButton from '@components/AppButton';
import images from '@assets/images';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { ScaleSize } from '@kits/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const BUTTON_SIZE = ScaleSize(40);
const ICON_SIZE = ScaleSize(20);

type Properties = {
  readonly onGoBack: () => void;
  readonly onPressMore: () => void;
};

/** Dải navy đầu màn chi tiết: quay lại, tiêu đề và nút tác vụ khác. */
function RequestDetailHeader({ onGoBack, onPressMore }: Properties) {
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
        style={styles.button}
        testID="RequestDetailBack"
      >
        <Image
          color={Colors.white}
          height={ICON_SIZE}
          name="ic_arrow_left_gray"
          type="svg"
          width={ICON_SIZE}
        />
      </AppButton>

      <View style={styles.titleBox}>
        <Text numberOfLines={1} style={styles.title}>
          {t('request_detail.title')}
        </Text>
      </View>
    </ImageBackground>
  );
}

export default React.memo(RequestDetailHeader);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: Colors.navy06,
    borderRadius: ScaleSize(12),
    height: BUTTON_SIZE,
    justifyContent: 'center',
    width: BUTTON_SIZE,
  },
  container: {
    alignItems: 'center',
    // Nền dự phòng cho khung hình đầu tiên, trước khi ảnh kịp decode.
    backgroundColor: Colors.navy05,
    flexDirection: 'row',
    paddingBottom: ScaleSize(28),
    paddingHorizontal: ScaleSize(16),
  },
  title: {
    color: Colors.white,
    fontSize: ScaleSize(19),
    fontWeight: '700',
  },
  titleBox: {
    flex: 1,
    paddingHorizontal: ScaleSize(12),
  },
});
