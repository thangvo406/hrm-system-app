import type { THomeShift } from '@type/home';

import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { SHEET_OVERLAP } from './layout';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const CARD_SHADOW_OFFSET = ScaleSize(8);
const CARD_SHADOW_OPACITY = 0.06;
const CARD_ELEVATION = 3;
const CTA_ICON_SIZE = ScaleSize(20);
const EYEBROW_TRACKING = ScaleSize(0.6);
const PUNCTUALITY_ICON_SIZE = ScaleSize(12);
const TIME_PLACEHOLDER = '--:--';

type Properties = {
  readonly onCheckOut: () => void;
  readonly shift: THomeShift;
};

/**
 * Thẻ ca làm việc hôm nay: giờ ca được phân, hai dấu chấm công vào/ra và nút
 * chấm công ra ca.
 */
function ShiftCard({ onCheckOut, shift }: Properties) {
  const { t } = useTranslation();
  const isOnTime = shift.punctuality === 'on_time';
  const hasCheckedOut = !!shift.checkOutAt;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.eyebrow}>{t('home.shift_today')}</Text>
        <View
          style={[
            styles.punctuality,
            isOnTime ? styles.punctualityOnTime : styles.punctualityLate,
          ]}
        >
          {isOnTime ? (
            <Image
              color={Colors.green08}
              height={PUNCTUALITY_ICON_SIZE}
              name="ic_check"
              type="svg"
              width={PUNCTUALITY_ICON_SIZE}
            />
          ) : undefined}
          <Text
            style={[
              styles.punctualityLabel,
              isOnTime
                ? styles.punctualityLabelOnTime
                : styles.punctualityLabelLate,
            ]}
          >
            {t(isOnTime ? 'home.shift_on_time' : 'home.shift_late')}
          </Text>
        </View>
      </View>

      <Text style={styles.shiftName}>
        {t('home.shift_window', {
          endAt: shift.endAt,
          name: shift.name,
          startAt: shift.startAt,
        })}
      </Text>

      <View style={styles.punchBox}>
        <View style={styles.punch}>
          <Text style={styles.punchLabel}>{t('home.check_in_label')}</Text>
          <Text
            style={[styles.punchValue, !shift.checkInAt && styles.punchEmpty]}
            testID="HomeCheckInValue"
          >
            {shift.checkInAt ?? TIME_PLACEHOLDER}
          </Text>
        </View>

        <View style={styles.punchDivider} />

        <View style={styles.punch}>
          <Text style={styles.punchLabel}>{t('home.check_out_label')}</Text>
          <Text
            style={[styles.punchValue, !shift.checkOutAt && styles.punchEmpty]}
            testID="HomeCheckOutValue"
          >
            {shift.checkOutAt ?? TIME_PLACEHOLDER}
          </Text>
        </View>
      </View>

      <AppButton
        disabled={hasCheckedOut}
        onPress={onCheckOut}
        style={[styles.cta, hasCheckedOut && styles.ctaDone]}
        testID="HomeCheckOutButton"
      >
        <Image
          color={hasCheckedOut ? Colors.gray24 : Colors.white}
          height={CTA_ICON_SIZE}
          name={hasCheckedOut ? 'ic_check' : 'ic_clock'}
          type="svg"
          width={CTA_ICON_SIZE}
        />
        <Text style={[styles.ctaLabel, hasCheckedOut && styles.ctaLabelDone]}>
          {t(hasCheckedOut ? 'home.check_out_done' : 'home.check_out_action')}
        </Text>
      </AppButton>
    </View>
  );
}

export default React.memo(ShiftCard);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(20),
    elevation: CARD_ELEVATION,
    marginHorizontal: ScaleSize(16),
    // Trùm lên dải navy `HeaderOverlap` đứng ngay trước nó trong vùng cuộn.
    marginTop: -SHEET_OVERLAP,
    padding: ScaleSize(16),
    shadowColor: Colors.navy04,
    shadowOffset: { height: CARD_SHADOW_OFFSET, width: 0 },
    shadowOpacity: CARD_SHADOW_OPACITY,
    shadowRadius: ScaleSize(16),
  },
  cta: {
    alignItems: 'center',
    backgroundColor: Colors.blue04,
    borderRadius: ScaleSize(14),
    flexDirection: 'row',
    gap: ScaleSize(10),
    height: ScaleSize(54),
    justifyContent: 'center',
    marginTop: ScaleSize(14),
  },
  ctaDone: {
    backgroundColor: Colors.gray21,
  },
  ctaLabel: {
    color: Colors.white,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  ctaLabelDone: {
    color: Colors.gray24,
  },
  eyebrow: {
    color: Colors.gray24,
    flex: 1,
    fontSize: ScaleSize(11),
    fontWeight: '600',
    letterSpacing: EYEBROW_TRACKING,
  },
  punch: {
    flex: 1,
    padding: ScaleSize(12),
  },
  punchBox: {
    backgroundColor: Colors.gray28,
    borderColor: Colors.gray27,
    borderRadius: ScaleSize(14),
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: ScaleSize(14),
  },
  punchDivider: {
    backgroundColor: Colors.gray27,
    marginVertical: ScaleSize(10),
    width: 1,
  },
  punchEmpty: {
    color: Colors.gray08,
  },
  punchLabel: {
    color: Colors.gray24,
    fontSize: ScaleSize(12),
  },
  punchValue: {
    color: Colors.navy04,
    fontSize: ScaleSize(22),
    fontWeight: '700',
    marginTop: ScaleSize(4),
  },
  punctuality: {
    alignItems: 'center',
    borderRadius: ScaleSize(20),
    flexDirection: 'row',
    gap: ScaleSize(4),
    paddingHorizontal: ScaleSize(10),
    paddingVertical: ScaleSize(5),
  },
  punctualityLabel: {
    fontSize: ScaleSize(12),
    fontWeight: '600',
  },
  punctualityLabelLate: {
    color: Colors.red03,
  },
  punctualityLabelOnTime: {
    color: Colors.green08,
  },
  punctualityLate: {
    backgroundColor: Colors.red02,
  },
  punctualityOnTime: {
    backgroundColor: Colors.green06,
  },
  shiftName: {
    color: Colors.navy04,
    fontSize: ScaleSize(17),
    fontWeight: '700',
    marginTop: ScaleSize(8),
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(8),
  },
});
