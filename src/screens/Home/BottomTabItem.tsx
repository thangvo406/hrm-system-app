import type { IconName } from '@assets/icons';

import AppButton from '@components/AppButton';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Image from '@components/Image';
import React, { useEffect } from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';

const TAB_ICON_SIZE = ScaleSize(24);
const ACTIVE_COLOR = Colors.blue04;
const INACTIVE_COLOR = Colors.gray24;

const SELECTED = 1;
const UNSELECTED = 0;
const FADE_DURATION = 180;

const BADGE_SIZE = ScaleSize(16);
const BADGE_OFFSET = ScaleSize(10);
const MAX_BADGE_COUNT = 99;

type Properties = {
  readonly badge?: number;
  readonly icon: IconName;
  readonly isActive: boolean;
  readonly label: string;
  readonly onPress: () => void;
  readonly testID?: string;
};

function BottomTabItem({
  badge,
  icon,
  isActive,
  label,
  onPress,
  testID,
}: Properties) {
  const progress = useSharedValue(isActive ? SELECTED : UNSELECTED);

  useEffect(() => {
    progress.set(
      withTiming(isActive ? SELECTED : UNSELECTED, {
        duration: FADE_DURATION,
      }),
    );
  }, [isActive, progress]);

  /**
   * Icon của tab đang chọn mờ đi vì chính viên tròn trượt tới đang mang icon
   * đó rồi — để cả hai cùng hiện là thấy hai icon chồng nhau lúc nó đang bay.
   *
   * CHỈ `opacity`, chạy thẳng trên GPU.
   */
  const iconStyle = useAnimatedStyle(() => ({
    opacity: SELECTED - progress.get(),
  }));

  return (
    <AppButton onPress={onPress} style={styles.container} testID={testID}>
      <Animated.View style={iconStyle}>
        <Image
          color={INACTIVE_COLOR}
          height={TAB_ICON_SIZE}
          name={icon}
          type="svg"
          width={TAB_ICON_SIZE}
        />
      </Animated.View>

      {badge ? (
        <View style={styles.badge}>
          <Text numberOfLines={1} style={styles.badgeLabel}>
            {badge > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : badge}
          </Text>
        </View>
      ) : undefined}

      <Text
        numberOfLines={1}
        style={[
          styles.label,
          { color: isActive ? ACTIVE_COLOR : INACTIVE_COLOR },
        ]}
      >
        {label}
      </Text>
    </AppButton>
  );
}

export default React.memo(BottomTabItem);

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: Colors.red01,
    borderRadius: BADGE_SIZE / 2,
    justifyContent: 'center',
    left: '50%',
    marginLeft: BADGE_OFFSET,
    minWidth: BADGE_SIZE,
    paddingHorizontal: ScaleSize(4),
    position: 'absolute',
    top: 0,
  },
  badgeLabel: {
    color: Colors.white,
    fontSize: ScaleSize(10),
    fontWeight: '700',
    lineHeight: BADGE_SIZE,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    gap: ScaleSize(4),
  },
  label: {
    fontSize: ScaleSize(11),
    textAlign: 'center',
  },
});
