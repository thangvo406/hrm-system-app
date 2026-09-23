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
const DRAFT_ICON_SIZE = ScaleSize(18);

type Properties = {
  readonly onGoBack: () => void;
  readonly onSaveDraft: () => void;
};

/** Dải navy đầu màn tạo đơn: nút quay lại, tiêu đề và nút lưu nháp. */
function CreateRequestHeader({ onGoBack, onSaveDraft }: Properties) {
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
        testID="CreateRequestBack"
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
          {t('create_request.title')}
        </Text>
      </View>

      <AppButton
        onPress={onSaveDraft}
        style={styles.draftButton}
        testID="CreateRequestSaveDraft"
      >
        <Image
          color={Colors.white}
          height={DRAFT_ICON_SIZE}
          name="ic_document"
          type="svg"
          width={DRAFT_ICON_SIZE}
        />
        <Text numberOfLines={1} style={styles.draftLabel}>
          {t('create_request.save_draft')}
        </Text>
      </AppButton>
    </ImageBackground>
  );
}

export default React.memo(CreateRequestHeader);

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
  draftButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(6),
  },
  draftLabel: {
    color: Colors.white,
    fontSize: ScaleSize(15),
    fontWeight: '600',
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
