import type { TRequestTab } from '@type/requests';
import type { LayoutChangeEvent } from 'react-native';

import AppButton from '@components/AppButton';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Image from '@components/Image';
import RequestTab from './RequestTab';
import RequestTabDivider from './RequestTabDivider';
import React, { useCallback, useEffect, useState } from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const FILTER_ICON_SIZE = ScaleSize(22);

const TRACK_PADDING = ScaleSize(4);
const PILL_RADIUS = ScaleSize(12);

const SLIDE_DURATION = 220;
const FIRST_TAB = 0;
const UNMEASURED = 0;

const TABS: readonly {
  readonly labelKey: string;
  readonly value: TRequestTab;
}[] = [
  { labelKey: 'requests.tab_all', value: 'all' },
  { labelKey: 'requests.tab_pending', value: 'pending' },
  { labelKey: 'requests.tab_processed', value: 'processed' },
];

/** Ranh giới giữa các ô: [1, 2] với ba tab. */
const BOUNDARIES = TABS.map((_, index) => index).filter(
  index => index > FIRST_TAB,
);

type Properties = {
  readonly counts: Record<TRequestTab, number>;
  readonly onChange: (tab: TRequestTab) => void;
  readonly onOpenFilter: () => void;
  readonly value: TRequestTab;
};

function RequestTabs({ counts, onChange, onOpenFilter, value }: Properties) {
  const { t } = useTranslation();
  const [trackWidth, setTrackWidth] = useState(UNMEASURED);

  const activeIndex = Math.max(
    TABS.findIndex(tab => tab.value === value),
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
    <View style={styles.container}>
      <View onLayout={onLayout} style={styles.track}>
        {trackWidth > UNMEASURED ? (
          <>
            <Animated.View style={[styles.pill, pillStyle]} />
            {BOUNDARIES.map(boundary => (
              <RequestTabDivider
                key={boundary}
                boundary={boundary}
                left={TRACK_PADDING + boundary * tabWidth}
                progress={progress}
              />
            ))}
          </>
        ) : undefined}

        {TABS.map((tab, index) => (
          <RequestTab
            key={tab.value}
            index={index}
            isActive={tab.value === value}
            label={t(tab.labelKey, { total: counts[tab.value] })}
            onChange={onChange}
            progress={progress}
            testID={`RequestsTab_${tab.value}`}
            value={tab.value}
          />
        ))}
      </View>

      <AppButton
        onPress={onOpenFilter}
        style={styles.filterButton}
        testID="RequestsFilter"
      >
        <Image
          color={Colors.gray17}
          height={FILTER_ICON_SIZE}
          name="ic_filter"
          type="svg"
          width={FILTER_ICON_SIZE}
        />
      </AppButton>
    </View>
  );
}

export default React.memo(RequestTabs);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(6),
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(16),
  },
  filterButton: {
    alignItems: 'center',
    height: ScaleSize(44),
    justifyContent: 'center',
    width: ScaleSize(32),
  },
  pill: {
    backgroundColor: Colors.blue02,
    borderRadius: PILL_RADIUS,
    bottom: TRACK_PADDING,
    left: TRACK_PADDING,
    position: 'absolute',
    top: TRACK_PADDING,
  },
  track: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(16),
    flex: 1,
    flexDirection: 'row',
    padding: TRACK_PADDING,
  },
});
