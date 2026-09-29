import type { IconName } from '@assets/icons';
import type { TAttendanceMode } from '@type/attendance';
import type { LayoutChangeEvent } from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import ModeTab from './ModeTab';
import React, { useCallback, useEffect, useState } from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { EAttendanceMode } from '@constants/config';

const TRACK_PADDING = ScaleSize(4);
const PILL_RADIUS = ScaleSize(11);

const SLIDE_DURATION = 220;
const FIRST_TAB = 0;
const UNMEASURED = 0;

const TABS: readonly {
  readonly icon: IconName;
  readonly labelKey: string;
  readonly mode: TAttendanceMode;
}[] = [
  {
    icon: 'ic_location',
    labelKey: 'attendance.modes.gps',
    mode: EAttendanceMode.GPS,
  },
  {
    icon: 'ic_qr_scan',
    labelKey: 'attendance.modes.qr',
    mode: EAttendanceMode.QR_CODE,
  },
];

type Properties = {
  readonly mode: TAttendanceMode;
  readonly onChangeMode: (mode: TAttendanceMode) => void;
};

function ModeTabs({ mode, onChangeMode }: Properties) {
  const { t } = useTranslation();
  const [trackWidth, setTrackWidth] = useState(UNMEASURED);

  const activeIndex = Math.max(
    TABS.findIndex(tab => tab.mode === mode),
    FIRST_TAB,
  );

  const progress = useSharedValue(activeIndex);

  useEffect(() => {
    progress.set(withTiming(activeIndex, { duration: SLIDE_DURATION }));
  }, [activeIndex, progress]);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width - TRACK_PADDING * 2);
  }, []);

  const tabWidth = trackWidth / TABS.length;

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.get() * tabWidth }],
    width: tabWidth,
  }));

  return (
    <View onLayout={onLayout} style={styles.container}>
      {trackWidth > UNMEASURED ? (
        <Animated.View style={[styles.pill, pillStyle]} />
      ) : undefined}

      {TABS.map((tab, index) => (
        <ModeTab
          key={tab.mode}
          icon={tab.icon}
          index={index}
          label={t(tab.labelKey)}
          mode={tab.mode}
          onChangeMode={onChangeMode}
          progress={progress}
          testID={`AttendanceMode_${tab.mode}`}
        />
      ))}
    </View>
  );
}

export default React.memo(ModeTabs);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.navy06,
    borderRadius: ScaleSize(14),
    flexDirection: 'row',
    marginTop: ScaleSize(16),
    padding: TRACK_PADDING,
  },
  pill: {
    backgroundColor: Colors.white,
    borderRadius: PILL_RADIUS,
    bottom: TRACK_PADDING,
    left: TRACK_PADDING,
    position: 'absolute',
    top: TRACK_PADDING,
  },
});
