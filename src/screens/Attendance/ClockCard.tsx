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
  readonly hasCheckedOut: boolean;
  readonly isInsideGeofence: boolean;
  readonly onCheckOut: () => void;
  readonly shift: TAttendanceShift;
};

/** Thẻ giữa màn: đồng hồ hiện tại và nút chấm công ra ca. */
function ClockCard({
  hasCheckedOut,
  isInsideGeofence,
  onCheckOut,
  shift,
}: Properties) {
  const { t } = useTranslation();
  const isDisabled = hasCheckedOut || !isInsideGeofence;

  return (
    <View style={styles.container}>
      <CurrentTime shift={shift} />

      <AppButton
        disabled={isDisabled}
        onPress={onCheckOut}
        style={[styles.cta, isDisabled && styles.ctaDisabled]}
        testID="AttendanceCheckOutButton"
      >
        <Image
          color={isDisabled ? Colors.gray24 : Colors.white}
          height={CTA_ICON_SIZE}
          name={hasCheckedOut ? 'ic_check' : 'ic_sign_out'}
          type="svg"
          width={CTA_ICON_SIZE}
        />
        <Text style={[styles.ctaLabel, isDisabled && styles.ctaLabelDisabled]}>
          {t(
            hasCheckedOut
              ? 'attendance.check_out_done'
              : 'attendance.check_out_action',
          )}
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
