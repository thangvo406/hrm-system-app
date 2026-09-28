import type { IconName } from '@assets/icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { LayoutChangeEvent } from 'react-native';

import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import BottomTabItem from './BottomTabItem';
import Image from '@components/Image';
import React, { useCallback, useEffect, useState } from 'react';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '@constants';
import { CommonActions } from '@react-navigation/native';
import { DeviceUtils } from '@kits/core/utils';
import { Paths } from '@navigation/paths';
import { ScaleSize } from '@kits/core';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const { ifAndroid, ifIphoneX } = DeviceUtils;

const AnimatedPath = Animated.createAnimatedComponent(Path);

const DISC_SIZE = ScaleSize(52);
const DISC_ICON_SIZE = ScaleSize(24);
/** Phần viên tròn nhô lên khỏi mép trên thanh tab. */
const DISC_RAISE = ScaleSize(22);

/** Bo hai góc trên của thanh. Để nhỏ vì chỗ khoét lõm cần chỗ ở hai tab rìa. */
const CORNER_RADIUS = ScaleSize(6);
/** Nửa bề ngang chỗ khoét — rộng hơn bán kính viên tròn để nó lọt vào lòng. */
const NOTCH_HALF_WIDTH = ScaleSize(44);
const NOTCH_HALF_WIDTH_OUTSITE = ScaleSize(36);
/** Chỗ khoét lõm xuống sâu bao nhiêu so với mép trên. */
const NOTCH_DEPTH = ScaleSize(32);
/** Điểm điều khiển Bézier: càng nhỏ thì vai lõm càng dốc. */
const NOTCH_SHOULDER = 0.42;
/** Điểm điều khiển Bézier ở đáy lõm: càng lớn thì đáy càng phẳng. */
const NOTCH_FLOOR = 0.6;

const HALF = 2;
const NOT_MEASURED = 0;
const SLIDE_DURATION = 260;
const FADE_DURATION = 180;
const HIDDEN = 0;
const VISIBLE = 1;

const SHADOW_OFFSET = ScaleSize(4);
const BAR_SHADOW_OPACITY = 0.08;
const DISC_SHADOW_OPACITY = 0.45;
const DISC_ELEVATION = 10;

/**
 * Nền thanh tab, có một chỗ lõm xuống ngay dưới viên tròn đang chọn.
 *
 * Chạy trên luồng UI (`worklet`) để chỗ lõm trượt cùng nhịp với viên tròn; trả
 * `d` về JS rồi set lại mỗi frame thì sẽ giật.
 *
 * `halfWidth` truyền vào chứ không đọc hằng số, vì hai tab rìa khoét hẹp hơn.
 * Tâm lõm vẫn bị kẹp trong khoảng an toàn để đường lõm không đâm vào phần góc
 * bo và làm méo hình — nay chỉ còn là lưới chặn cho màn hẹp.
 */
const buildBarPath = (
  width: number,
  height: number,
  notchCenterX: number,
  halfWidth: number,
): string => {
  'worklet';
  const minCenter = CORNER_RADIUS + halfWidth;
  const maxCenter = width - CORNER_RADIUS - halfWidth;
  const center = Math.min(Math.max(notchCenterX, minCenter), maxCenter);

  const left = center - halfWidth;
  const right = center + halfWidth;
  const shoulder = halfWidth * NOTCH_SHOULDER;
  const floor = halfWidth * NOTCH_FLOOR;

  return [
    `M0,${CORNER_RADIUS}`,
    `Q0,0 ${CORNER_RADIUS},0`,
    `L${left},0`,
    `C${left + shoulder},0 ${center - floor},${NOTCH_DEPTH} ${center},${NOTCH_DEPTH}`,
    `C${center + floor},${NOTCH_DEPTH} ${right - shoulder},0 ${right},0`,
    `L${width - CORNER_RADIUS},0`,
    `Q${width},0 ${width},${CORNER_RADIUS}`,
    `L${width},${height}`,
    `L0,${height}`,
    'Z',
  ].join(' ');
};

type TabItem = {
  readonly icon: IconName;
  readonly key: string;
  readonly labelKey: string;
};

/**
 * Trang chủ đứng GIỮA: nó là route mở đầu, nên viên tròn nằm sẵn ở chính giữa
 * thanh lúc mở app — đúng dáng của bản thiết kế.
 */
const TABS: readonly TabItem[] = [
  { icon: 'ic_clock', key: Paths.Attendance, labelKey: 'home.tab_attendance' },
  { icon: 'ic_document', key: Paths.Requests, labelKey: 'home.tab_requests' },
  { icon: 'ic_home', key: Paths.Home, labelKey: 'home.tab_home' },
  { icon: 'ic_bell', key: Paths.Notifications, labelKey: 'home.tab_notify' },
  { icon: 'user', key: Paths.Profile, labelKey: 'home.tab_profile' },
];

/** Hai tab rìa khoét hẹp hơn để đường lõm không chạm vào góc bo của thanh. */
const getNotchHalfWidth = (index: number) =>
  index === 0 || index === TABS.length - 1
    ? NOTCH_HALF_WIDTH_OUTSITE
    : NOTCH_HALF_WIDTH;

function BottomTabBar({ insets, navigation, state }: BottomTabBarProps) {
  const { t } = useTranslation();
  const [bar, setBar] = useState({ height: NOT_MEASURED, width: NOT_MEASURED });

  const activeRoute = state.routes[state.index];
  const activeIndex = TABS.findIndex(tab => tab.key === activeRoute?.name);
  const activeTab = TABS[activeIndex];

  const tabWidth = bar.width / TABS.length;
  /** Vị trí đứng yên của viên tròn khi đã tới đúng tab đang chọn. */
  const restingX = activeIndex * tabWidth + (tabWidth - DISC_SIZE) / HALF;

  const restingHalfWidth = getNotchHalfWidth(activeIndex);

  const discX = useSharedValue(restingX);
  const discOpacity = useSharedValue(HIDDEN);
  // Bề ngang lõm cũng phải chạy: rời tab rìa sang tab giữa là hai giá trị khác
  // nhau, nhảy cóc thì thấy chỗ lõm giật phình ra giữa đường trượt.
  const notchHalfWidth = useSharedValue(restingHalfWidth);

  useEffect(() => {
    if (bar.width === NOT_MEASURED || activeIndex < NOT_MEASURED) {
      return;
    }

    // Lần đầu đo xong thì đặt thẳng vào chỗ rồi mới hiện ra — không thì viên
    // tròn sẽ bay từ mép trái sang, trông như một cú trượt vô cớ lúc mở app.
    if (discOpacity.get() === HIDDEN) {
      discX.set(restingX);
      notchHalfWidth.set(restingHalfWidth);
      discOpacity.set(withTiming(VISIBLE, { duration: FADE_DURATION }));
      return;
    }

    discX.set(withTiming(restingX, { duration: SLIDE_DURATION }));
    notchHalfWidth.set(
      withTiming(restingHalfWidth, { duration: SLIDE_DURATION }),
    );
  }, [
    activeIndex,
    bar.width,
    discOpacity,
    discX,
    notchHalfWidth,
    restingHalfWidth,
    restingX,
  ]);

  // CHỈ `transform` và `opacity` — chạy thẳng trên GPU, không tính lại bố cục.
  const discStyle = useAnimatedStyle(() => ({
    opacity: discOpacity.get(),
    transform: [{ translateX: discX.get() }],
  }));

  // Chỗ lõm bám theo đúng tâm viên tròn nên hai thứ luôn khớp nhau.
  const pathProps = useAnimatedProps(() => ({
    d: buildBarPath(
      bar.width,
      bar.height,
      discX.get() + DISC_SIZE / HALF,
      notchHalfWidth.get(),
    ),
  }));

  const onBarLayout = useCallback((event: LayoutChangeEvent) => {
    const { height, width } = event.nativeEvent.layout;
    setBar(current =>
      current.height === height && current.width === width
        ? current
        : { height, width },
    );
  }, []);

  const handlePress = useCallback(
    (routeName: string) => {
      navigation.dispatch(CommonActions.navigate(routeName));
    },
    [navigation],
  );

  const isMeasured = bar.width > NOT_MEASURED && bar.height > NOT_MEASURED;

  return (
    <View
      onLayout={onBarLayout}
      style={[
        styles.bar,
        { paddingBottom: ifAndroid(16, ifIphoneX(insets.bottom, 10)) },
      ]}
    >
      {isMeasured ? (
        <Svg
          height={bar.height}
          pointerEvents="none"
          style={styles.background}
          width={bar.width}
        >
          <AnimatedPath animatedProps={pathProps} fill={Colors.white} />
        </Svg>
      ) : undefined}

      {isMeasured && activeTab ? (
        <Animated.View style={[styles.disc, discStyle]}>
          <Image
            color={Colors.white}
            height={DISC_ICON_SIZE}
            name={activeTab.icon}
            type="svg"
            width={DISC_ICON_SIZE}
          />
        </Animated.View>
      ) : undefined}

      {TABS.map(tab => (
        <BottomTabItem
          key={tab.key}
          icon={tab.icon}
          isActive={activeRoute?.name === tab.key}
          label={t(tab.labelKey)}
          onPress={() => handlePress(tab.key)}
          testID={`bottom-tab-${tab.key}`}
        />
      ))}
    </View>
  );
}

export default React.memo(BottomTabBar);

const styles = StyleSheet.create({
  /**
   * Nền do SVG vẽ nên ô này KHÔNG có `backgroundColor` — tô màu ở đây là lấp
   * mất chỗ lõm vừa khoét. Bóng cũng phải nằm trên SVG chứ không phải ô này,
   * vì bóng của `View` bám theo hình chữ nhật chứ không theo đường path.
   */
  background: {
    left: 0,
    position: 'absolute',
    shadowColor: Colors.navy04,
    shadowOffset: { height: -SHADOW_OFFSET, width: 0 },
    shadowOpacity: BAR_SHADOW_OPACITY,
    shadowRadius: ScaleSize(12),
    top: 0,
  },
  bar: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingTop: ScaleSize(14),
  },
  // Nằm tuyệt đối để trượt được bằng `translateX` mà không đụng tới bố cục
  // của năm tab bên dưới.
  disc: {
    alignItems: 'center',
    backgroundColor: Colors.blue02,
    borderRadius: DISC_SIZE / HALF,
    elevation: DISC_ELEVATION,
    height: DISC_SIZE,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    shadowColor: Colors.blue02,
    shadowOffset: { height: SHADOW_OFFSET, width: 0 },
    shadowOpacity: DISC_SHADOW_OPACITY,
    shadowRadius: ScaleSize(12),
    top: -DISC_RAISE,
    width: DISC_SIZE,
  },
});
