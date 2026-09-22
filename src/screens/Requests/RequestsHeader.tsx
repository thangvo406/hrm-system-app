import AppButton from '@components/AppButton';
import images from '@assets/images';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { ScaleSize } from '@kits/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const CREATE_ICON_SIZE = ScaleSize(20);

type Properties = {
  readonly onPressCreate: () => void;
};

function RequestsHeader({ onPressCreate }: Properties) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <ImageBackground
      resizeMode="cover"
      source={images.bg_home_header}
      style={[styles.container, { paddingTop: insets.top + ScaleSize(8) }]}
    >
      <View style={styles.titleBox}>
        <Text numberOfLines={1} style={styles.title}>
          {t('requests.title')}
        </Text>
        <Text numberOfLines={2} style={styles.subtitle}>
          {t('requests.subtitle')}
        </Text>
      </View>

      <AppButton
        onPress={onPressCreate}
        style={styles.createButton}
        testID="RequestsCreate"
      >
        <Image
          color={Colors.white}
          height={CREATE_ICON_SIZE}
          name="ic_plus_circle"
          type="svg"
          width={CREATE_ICON_SIZE}
        />
        <Text numberOfLines={1} style={styles.createLabel}>
          {t('requests.create')}
        </Text>
      </AppButton>
    </ImageBackground>
  );
}

export default React.memo(RequestsHeader);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    // Nền dự phòng cho khung hình đầu tiên, trước khi ảnh kịp decode.
    backgroundColor: Colors.navy05,
    flexDirection: 'row',
    gap: ScaleSize(12),
    paddingBottom: ScaleSize(28),
    paddingHorizontal: ScaleSize(16),
  },
  createButton: {
    alignItems: 'center',
    backgroundColor: Colors.blue02,
    borderRadius: ScaleSize(14),
    flexDirection: 'row',
    gap: ScaleSize(8),
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(12),
  },
  createLabel: {
    color: Colors.white,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.blue05,
    fontSize: ScaleSize(13),
    marginTop: ScaleSize(4),
  },
  title: {
    color: Colors.white,
    fontSize: ScaleSize(24),
    fontWeight: '700',
  },
  titleBox: {
    flex: 1,
  },
});
