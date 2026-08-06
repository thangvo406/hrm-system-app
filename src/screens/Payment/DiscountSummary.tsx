import { AppButton, Image } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import { useTranslation } from 'react-i18next';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import React, { useMemo, useState } from 'react';
import { IPriceDetail } from '@type';

type Properties = {
  readonly data: IPriceDetail;
};

const CHEVRON_SIZE = ScaleSize(16);
const EXPAND_DURATION = 220;
const HALF_TURN_DEGREES = 180;
// Detail rows are single-line, so the expanded height is known up front — no
// need to measure a container that starts collapsed at height 0.
const DETAIL_ROW_HEIGHT = ScaleSize(28);
const DETAIL_BOTTOM_SPACE = ScaleSize(4);

function DiscountSummary({ data }: Properties) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  // 0 = collapsed, 1 = expanded. Drives both the detail height and the chevron.
  const progress = useSharedValue(0);
  const details = useMemo(() => {
    const keys = Object.keys(data || {}).filter(
      it =>
        data[it] > 0 &&
        !['totalMoney', 'totalDiscount', 'finalMoney'].includes(it),
    );
    return keys.map(key => {
      return {
        key: `payment.price_detail.${key?.toLowerCase()}`,
        value: data[key] as number,
      };
    });
  }, [data]);

  const formatDiscount = (value: number) =>
    `-${t('common.display_price', { amount: formatCurrency(value) })}`;

  const onToggle = () => {
    const nextExpanded = !expanded;
    setExpanded(nextExpanded);
    progress.value = withTiming(nextExpanded ? 1 : 0, {
      duration: EXPAND_DURATION,
      easing: nextExpanded ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
    });
  };

  const expandedHeight =
    details.length * DETAIL_ROW_HEIGHT + DETAIL_BOTTOM_SPACE;

  const detailStyle = useAnimatedStyle(() => ({
    height: progress.value * expandedHeight,
    opacity: progress.value,
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * HALF_TURN_DEGREES}deg` }],
  }));

  if (data?.totalDiscount <= 0) {
    return undefined;
  }

  return (
    <View style={styles.wrap}>
      <AppButton
        onPress={onToggle}
        style={styles.summaryRow}
        testID="payment-toggle-discount"
      >
        <View style={styles.labelWrap}>
          <Text style={styles.summaryLabel}>
            {t('payment.price_detail.totaldiscount')}
          </Text>
          <Animated.View style={chevronStyle}>
            <Image
              color={Colors.gray13}
              height={CHEVRON_SIZE}
              name="ic_chevron_up"
              type="svg"
              width={CHEVRON_SIZE}
            />
          </Animated.View>
        </View>
        <Text style={styles.summaryValue}>
          {formatDiscount(data?.totalDiscount)}
        </Text>
      </AppButton>

      <Animated.View style={[styles.detailClip, detailStyle]}>
        {details.map(({ key, value }) => (
          <View key={key} style={styles.detailRow}>
            <Text numberOfLines={1} style={styles.detailLabel}>
              {t(key)}
            </Text>
            <Text numberOfLines={1} style={styles.detailValue}>
              {formatDiscount(value)}
            </Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

export default React.memo(DiscountSummary);

const styles = StyleSheet.create({
  detailClip: {
    overflow: 'hidden',
  },
  detailLabel: {
    color: Colors.gray13,
    fontSize: ScaleSize(13),
  },
  detailRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: DETAIL_ROW_HEIGHT,
    justifyContent: 'space-between',
    paddingLeft: ScaleSize(12),
  },
  detailValue: {
    color: Colors.red01,
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
  labelWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(4),
  },
  summaryLabel: {
    color: Colors.black01,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: ScaleSize(12),
  },
  summaryValue: {
    color: Colors.red01,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
  wrap: {
    borderBottomColor: Colors.gray16,
    borderBottomWidth: 1,
  },
});
