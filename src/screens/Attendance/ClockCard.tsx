import type { TAttendanceShift } from '@type/attendance';

import AppButton from '@components/AppButton';
import CurrentTime from './CurrentTime';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const CARD_SHADOW_OFFSET = ScaleSize(8);
const CARD_SHADOW_OPACITY = 0.06;
const CARD_ELEVATION = 3;
const CTA_ICON_SIZE = ScaleSize(20);

type Properties = {
  readonly hasCheckedIn: boolean;
  readonly hasCheckedOut: boolean;
  readonly isInsideGeofence: boolean;
  readonly onPunch: () => void;
  readonly shift: TAttendanceShift;
};

/**
 * Thẻ giữa màn: đồng hồ hiện tại và nút chấm công.
 *
 * Một nút phục vụ cả ngày công: chưa vào ca thì chấm vào, đã vào ca thì chấm
 * ra, chấm ra rồi thì khoá lại.
 */
function ClockCard({
  hasCheckedIn,
  hasCheckedOut,
  isInsideGeofence,
  onPunch,
  shift,
}: Properties) {
  const { t } = useTranslation();
  const isDisabled = hasCheckedOut || !isInsideGeofence;

  const getLabelKey = () => {
    if (hasCheckedOut) {
      return 'attendance.check_out_done';
    }
    return hasCheckedIn
      ? 'attendance.check_out_action'
      : 'attendance.check_in_action';
  };

  const getIconName = () => {
    if (hasCheckedOut) {
      return 'ic_check';
    }
    return hasCheckedIn ? 'ic_sign_out' : 'ic_sign_in';
  };

  return (
    <View style={styles.container}>
      <CurrentTime shift={shift} />

      <AppButton
        disabled={isDisabled}
        onPress={onPunch}
        style={[styles.cta, isDisabled && styles.ctaDisabled]}
        testID="AttendancePunchButton"
      >
        <Image
          color={isDisabled ? Colors.gray24 : Colors.white}
          height={CTA_ICON_SIZE}
          name={getIconName()}
          type="svg"
          width={CTA_ICON_SIZE}
        />
        <Text style={[styles.ctaLabel, isDisabled && styles.ctaLabelDisabled]}>
          {t(getLabelKey())}
        </Text>
      </AppButton>
    </View>
  );
}

export default React.memo(ClockCard);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(20),
    elevation: CARD_ELEVATION,
    marginHorizontal: ScaleSize(16),
    marginTop: ScaleSize(12),
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
    marginTop: ScaleSize(16),
  },
  ctaDisabled: {
    backgroundColor: Colors.gray21,
  },
  ctaLabel: {
    color: Colors.white,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  ctaLabelDisabled: {
    color: Colors.gray24,
  },
});
