import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';

const AVATAR_SIZE = ScaleSize(76);
const BADGE_SIZE = ScaleSize(28);
const BADGE_ICON_SIZE = ScaleSize(15);
const CARD_SHADOW_OFFSET = ScaleSize(4);
const CARD_SHADOW_RADIUS = ScaleSize(10);
const CARD_SHADOW_OPACITY = 0.05;
const CARD_ELEVATION = 2;

type Properties = {
  readonly fullName: string;
  readonly initials: string;
  readonly jobTitle: string;
  readonly onChangePhoto: () => void;
};

/**
 * Thẻ ảnh đại diện. Cả màn này chỉ đọc, nên nút đổi ảnh là hành động duy nhất
 * — vì vậy nó được tô đặc và viền trắng để tách hẳn khỏi ô avatar.
 */
function AvatarCard({
  fullName,
  initials,
  jobTitle,
  onChangePhoto,
}: Properties) {
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{initials}</Text>
        </View>

        <AppButton
          onPress={onChangePhoto}
          style={styles.badge}
          testID="ProfileInformationChangePhoto"
        >
          <Image
            color={Colors.white}
            height={BADGE_ICON_SIZE}
            name="ic_camera"
            type="svg"
            width={BADGE_ICON_SIZE}
          />
        </AppButton>
      </View>

      <Text numberOfLines={1} style={styles.name}>
        {fullName}
      </Text>
      {/* Hồ sơ từ API chưa có chức danh; bỏ hẳn dòng thay vì để khoảng trống. */}
      {jobTitle ? (
        <Text numberOfLines={1} style={styles.jobTitle}>
          {jobTitle}
        </Text>
      ) : undefined}
    </View>
  );
}

export default React.memo(AvatarCard);

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: Colors.blue06,
    borderRadius: AVATAR_SIZE / 2,
    height: AVATAR_SIZE,
    justifyContent: 'center',
    width: AVATAR_SIZE,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: Colors.blue02,
    borderColor: Colors.white,
    borderRadius: BADGE_SIZE / 2,
    borderWidth: ScaleSize(2),
    bottom: 0,
    height: BADGE_SIZE,
    justifyContent: 'center',
    position: 'absolute',
    right: -ScaleSize(2),
    width: BADGE_SIZE,
  },
  container: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(16),
    elevation: CARD_ELEVATION,
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(20),
    shadowColor: Colors.navy04,
    shadowOffset: { height: CARD_SHADOW_OFFSET, width: 0 },
    shadowOpacity: CARD_SHADOW_OPACITY,
    shadowRadius: CARD_SHADOW_RADIUS,
  },
  initials: {
    color: Colors.blue02,
    fontSize: ScaleSize(26),
    fontWeight: '700',
  },
  jobTitle: {
    color: Colors.gray17,
    fontSize: ScaleSize(14),
    marginTop: ScaleSize(2),
  },
  name: {
    color: Colors.navy04,
    fontSize: ScaleSize(18),
    fontWeight: '700',
    marginTop: ScaleSize(14),
  },
});
