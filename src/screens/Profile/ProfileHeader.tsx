import type { TProfileEmployee } from '@type/profile';

import images from '@assets/images';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { Image as BackgroundImage, StyleSheet, Text, View } from 'react-native';
import { ScaleSize } from '@kits/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const AVATAR_SIZE = ScaleSize(84);
const TAGLINE_ICON_SIZE = ScaleSize(18);
/** Tỉ lệ thật của `bg_profile.png` (1886×834). */
const BACKGROUND_RATIO = 2.261;

type Properties = {
  readonly employee: TProfileEmployee;
};

/**
 * Dải đầu màn Cá nhân: ảnh nền `bg_profile`, danh tính canh giữa và một câu
 * ngắn về nơi làm việc.
 *
 * Danh tính nằm hẳn trong header chứ không phải thẻ trắng riêng — đây là màn
 * "về bạn", nên tên là thứ mở màn, không phải một tiêu đề.
 */
function ProfileHeader({ employee }: Properties) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { paddingTop: 0 }]}>
      {/*
        Neo ảnh vào mép PHẢI và giữ đúng tỉ lệ gốc, để cao bằng header rồi cho
        tràn sang trái. Ảnh rộng 2.26:1 mà header thì gần vuông — dùng
        `resizeMode="cover"` sẽ cắt đều hai bên và mất mấy toà nhà nằm sát mép
        phải, trong khi phần trái chỉ là sóng mờ, cắt đi không tiếc.
      */}
      <BackgroundImage source={images.bg_profile} style={styles.background} />

      <View style={[styles.avatar, { marginTop: insets.top + ScaleSize(24) }]}>
        <Text style={styles.initials}>{employee.initials}</Text>
      </View>

      <Text numberOfLines={1} style={styles.name}>
        {employee.fullName}
      </Text>
      <Text numberOfLines={1} style={styles.jobTitle}>
        {employee.jobTitle}
      </Text>
      <Text numberOfLines={2} style={styles.department}>
        {employee.department}
      </Text>

      <View style={styles.tagline}>
        <Image
          color={Colors.blue02}
          height={TAGLINE_ICON_SIZE}
          name="ic_users"
          type="svg"
          width={TAGLINE_ICON_SIZE}
        />
        <Text numberOfLines={2} style={styles.taglineLabel}>
          {t('profile.tagline')}
        </Text>
      </View>
    </View>
  );
}

export default React.memo(ProfileHeader);

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: AVATAR_SIZE / 2,
    height: AVATAR_SIZE,
    justifyContent: 'center',
    width: AVATAR_SIZE,
  },
  background: {
    aspectRatio: BACKGROUND_RATIO,
    bottom: 0,
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    width: undefined,
  },
  container: {
    alignItems: 'center',
    // Nền dự phòng cho khung hình đầu tiên, trước khi ảnh kịp decode.
    backgroundColor: Colors.blue07,
    overflow: 'hidden',
    paddingBottom: ScaleSize(24),
    paddingHorizontal: ScaleSize(16),
  },
  department: {
    color: Colors.gray17,
    fontSize: ScaleSize(14),
    marginTop: ScaleSize(2),
    textAlign: 'center',
  },
  initials: {
    color: Colors.blue02,
    fontSize: ScaleSize(30),
    fontWeight: '700',
  },
  jobTitle: {
    color: Colors.gray17,
    fontSize: ScaleSize(14),
    marginTop: ScaleSize(6),
    textAlign: 'center',
  },
  name: {
    color: Colors.navy04,
    fontSize: ScaleSize(22),
    fontWeight: '700',
    marginTop: ScaleSize(14),
  },
  tagline: {
    alignItems: 'center',
    backgroundColor: Colors.blue07,
    borderRadius: ScaleSize(20),
    flexDirection: 'row',
    gap: ScaleSize(8),
    marginTop: ScaleSize(16),
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(10),
  },
  taglineLabel: {
    color: Colors.blue04,
    flexShrink: 1,
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
});
