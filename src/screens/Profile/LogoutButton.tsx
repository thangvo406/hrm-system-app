import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

const ICON_SIZE = ScaleSize(20);

type Properties = {
  readonly onLogout: () => void;
};

/** Nút đăng xuất ở cuối danh sách. */
function LogoutButton({ onLogout }: Properties) {
  const { t } = useTranslation();

  return (
    <AppButton
      onPress={onLogout}
      style={styles.container}
      testID="ProfileLogout"
    >
      <Image
        color={Colors.red03}
        height={ICON_SIZE}
        name="ic_sign_out"
        type="svg"
        width={ICON_SIZE}
      />
      <Text style={styles.label}>{t('profile.logout')}</Text>
    </AppButton>
  );
}

export default React.memo(LogoutButton);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    // Nền hồng nhạt thay vì đỏ đặc: đăng xuất là hành động phá huỷ nhưng không
    // phải việc chính của màn, không nên hút mắt hơn phần nội dung.
    backgroundColor: Colors.red02,
    borderColor: Colors.red03,
    borderRadius: ScaleSize(14),
    borderWidth: 1,
    flexDirection: 'row',
    gap: ScaleSize(10),
    justifyContent: 'center',
    paddingVertical: ScaleSize(16),
  },
  label: {
    color: Colors.red03,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
});
