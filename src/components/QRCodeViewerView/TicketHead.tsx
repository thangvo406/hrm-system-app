import Image from '@components/Image';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const HEAD_GRADIENT = [Colors.green01, Colors.green10];
const HEAD_GRADIENT_END = { x: 1, y: 1 };
const HEAD_GRADIENT_START = { x: 0, y: 0 };
const LEAF_DECOR_SIZE = ScaleSize(140);
const SPARKLE_SIZE = ScaleSize(11);

// Transparency over the green head, so one set of values works for every
// gradient stop underneath it.
const AMOUNT_COLOR = 'rgba(255, 255, 255, 0.88)';
const CHIP_COLOR = 'rgba(255, 255, 255, 0.16)';
const LEAF_DECOR_COLOR = 'rgba(255, 255, 255, 0.09)';
const RULE_COLOR = 'rgba(255, 255, 255, 0.35)';
const SPARKLE_COLOR = 'rgba(255, 255, 255, 0.85)';
const SUBTITLE_COLOR = 'rgba(255, 255, 255, 0.78)';

type Properties = {
  readonly amountText?: string;
  readonly badge?: string;
  readonly subtitle: string;
  readonly title?: string;
};

/**
 * Top half of the ticket: the coupon's own name, set on deep green so the
 * white stub below reads as the part that gets scanned.
 */
function TicketHead({ amountText, badge, subtitle, title }: Properties) {
  return (
    // Plain View owns the rounding + clip. react-native-linear-gradient does
    // not reliably respect per-corner radii (borderTopLeftRadius etc.) on its
    // own paint path, so the gradient itself is a radius-less absolute-fill
    // layer and lets this View's overflow:hidden do the actual clipping.
    <View style={styles.head}>
      <LinearGradient
        colors={HEAD_GRADIENT}
        end={HEAD_GRADIENT_END}
        start={HEAD_GRADIENT_START}
        style={styles.gradientFill}
      />

      <View style={styles.content}>
        <View pointerEvents="none" style={styles.leafDecor}>
          <Image
            color={LEAF_DECOR_COLOR}
            height={LEAF_DECOR_SIZE}
            name="ic_leaf"
            type="svg"
            width={LEAF_DECOR_SIZE}
          />
        </View>

        {!!badge && (
          <View style={styles.chip}>
            <Text style={styles.chipText}>{badge}</Text>
          </View>
        )}

        {!!title && (
          <View style={styles.titleRow}>
            <View style={styles.rule} />
            <Image
              color={SPARKLE_COLOR}
              height={SPARKLE_SIZE}
              name="ic_sparkle"
              type="svg"
              width={SPARKLE_SIZE}
            />
            <Text numberOfLines={2} style={styles.title}>
              {title}
            </Text>
            <Image
              color={SPARKLE_COLOR}
              height={SPARKLE_SIZE}
              name="ic_sparkle"
              type="svg"
              width={SPARKLE_SIZE}
            />
            <View style={styles.rule} />
          </View>
        )}

        {!!amountText && <Text style={styles.amount}>{amountText}</Text>}

        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

export default React.memo(TicketHead);

const styles = StyleSheet.create({
  amount: {
    color: AMOUNT_COLOR,
    fontSize: ScaleSize(14),
    fontVariant: ['tabular-nums'],
    fontWeight: '700',
    marginTop: ScaleSize(10),
    textAlign: 'center',
  },
  chip: {
    alignSelf: 'center',
    backgroundColor: CHIP_COLOR,
    borderRadius: ScaleSize(20),
    marginBottom: ScaleSize(12),
    paddingHorizontal: ScaleSize(12),
    paddingVertical: ScaleSize(5),
  },
  chipText: {
    color: Colors.white,
    fontSize: ScaleSize(11),
    fontWeight: '700',
    letterSpacing: ScaleSize(0.4),
  },
  content: {
    paddingBottom: ScaleSize(26),
    paddingHorizontal: ScaleSize(24),
    paddingTop: ScaleSize(38),
  },
  gradientFill: {
    ...StyleSheet.absoluteFillObject,
  },
  head: {
    borderTopLeftRadius: ScaleSize(24),
    borderTopRightRadius: ScaleSize(24),
    overflow: 'hidden',
    width: '100%',
  },
  leafDecor: {
    bottom: -ScaleSize(30),
    position: 'absolute',
    right: -ScaleSize(28),
    transform: [{ rotate: '18deg' }],
  },
  rule: {
    backgroundColor: RULE_COLOR,
    height: ScaleSize(1.5),
    width: ScaleSize(22),
  },
  subtitle: {
    color: SUBTITLE_COLOR,
    fontSize: ScaleSize(13),
    fontWeight: '500',
    marginTop: ScaleSize(8),
    textAlign: 'center',
  },
  title: {
    color: Colors.white,
    flexShrink: 1,
    fontSize: ScaleSize(26),
    fontWeight: '800',
    letterSpacing: ScaleSize(-0.4),
    textAlign: 'center',
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(10),
    justifyContent: 'center',
  },
});
