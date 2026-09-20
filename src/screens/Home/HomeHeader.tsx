import type { LayoutChangeEvent } from 'react-native';
import type { THomeEmployee } from '@type/home';

import AppButton from '@components/AppButton';
import Image from '@components/Image';
import imageNames from '@assets/images/names';
import React from 'react';
import { Colors } from '@constants';
import { HEADER_BACKGROUND_WIDTH, SHEET_OVERLAP } from './layout';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const AVATAR_SIZE = ScaleSize(48);
const BELL_BUTTON_SIZE = ScaleSize(44);
const BELL_ICON_SIZE = ScaleSize(22);
const UNREAD_DOT_SIZE = ScaleSize(9);

type Properties = {
  readonly employee: THomeEmployee;
  readonly greetingKey: string;
  /** Chiều cao header do `useHome` đo được; 0 ở lần render đầu. */
  readonly height: number;
  readonly onLayout: (event: LayoutChangeEvent) => void;
  readonly onPressNotificationCenter: () => void;
};

/** Dải navy đầu màn: avatar, lời chào, đơn vị công tác và chuông thông báo. */
function HomeHeader({
  employee,
  greetingKey,
  height,
  onLayout,
  onPressNotificationCenter,
}: Properties) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View
      onLayout={onLayout}
      style={[styles.container, { paddingTop: insets.top + ScaleSize(12) }]}
    >
      {height > 0 && (
        // Khung ảnh cao hơn header đúng SHEET_OVERLAP: phần dôi ra bị
        // `overflow: hidden` cắt ở đây, và chính phần đó được `HeaderOverlap`
        // vẽ tiếp bên trong vùng cuộn nên hai mảng nối liền nhau.
        <Image
          height={height + SHEET_OVERLAP}
          name={imageNames.bg_home_header}
          resizeMode="cover"
          style={styles.background}
          width={HEADER_BACKGROUND_WIDTH}
        />
      )}

      <View style={styles.avatar}>
        <Text style={styles.initials}>{employee.initials}</Text>
      </View>

      <View style={styles.identity}>
        <Text style={styles.greeting}>{t(greetingKey)}</Text>
        <Text numberOfLines={1} style={styles.name}>
          {employee.fullName}
        </Text>
        <Text numberOfLines={1} style={styles.meta}>
          {t('home.employee_meta', {
            code: employee.code,
            department: employee.department,
          })}
        </Text>
      </View>

      <AppButton
        onPress={onPressNotificationCenter}
        style={styles.bellButton}
        testID="HomeNotificationCenter"
      >
        <Image
          color={Colors.white}
          height={BELL_ICON_SIZE}
          name="ic_bell"
          type="svg"
          width={BELL_ICON_SIZE}
        />
        {employee.unreadNotifications > 0 && <View style={styles.unreadDot} />}
      </AppButton>
    </View>
  );
}

export default React.memo(HomeHeader);

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: Colors.navy06,
    borderRadius: ScaleSize(14),
    height: AVATAR_SIZE,
    justifyContent: 'center',
    width: AVATAR_SIZE,
  },
  background: {
    left: 0,
    position: 'absolute',
    top: 0,
  },
  bellButton: {
    alignItems: 'center',
    backgroundColor: Colors.navy06,
    borderRadius: ScaleSize(14),
    height: BELL_BUTTON_SIZE,
    justifyContent: 'center',
    width: BELL_BUTTON_SIZE,
  },
  container: {
    alignItems: 'center',
    // Nền dự phòng cho khung hình đầu tiên, khi chiều cao header chưa đo xong
    // nên ảnh chưa vẽ.
    backgroundColor: Colors.navy05,
    flexDirection: 'row',
    gap: ScaleSize(12),
    overflow: 'hidden',
    paddingBottom: ScaleSize(20),
    paddingHorizontal: ScaleSize(16),
  },
  greeting: {
    color: Colors.blue05,
    fontSize: ScaleSize(13),
  },
  identity: {
    flex: 1,
  },
  initials: {
    color: Colors.white,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  meta: {
    color: Colors.blue05,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(3),
  },
  name: {
    color: Colors.white,
    fontSize: ScaleSize(17),
    fontWeight: '700',
    marginTop: ScaleSize(2),
  },
  unreadDot: {
    backgroundColor: Colors.yellow01,
    borderRadius: UNREAD_DOT_SIZE / 2,
    height: UNREAD_DOT_SIZE,
    position: 'absolute',
    right: ScaleSize(9),
    top: ScaleSize(9),
    width: UNREAD_DOT_SIZE,
  },
});
