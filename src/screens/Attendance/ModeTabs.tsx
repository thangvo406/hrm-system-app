import type { IconName } from '@assets/icons';
import type { TAttendanceMode } from '@type/attendance';

import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { EAttendanceMode } from '@constants/config';

const TAB_ICON_SIZE = ScaleSize(18);

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

/** Bộ chuyển giữa chấm công bằng định vị và bằng mã QR. */
function ModeTabs({ mode, onChangeMode }: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {TABS.map(tab => {
        const isActive = tab.mode === mode;
        return (
          <AppButton
            key={tab.mode}
            onPress={() => onChangeMode(tab.mode)}
            style={[styles.tab, isActive && styles.tabActive]}
            testID={`AttendanceMode_${tab.mode}`}
          >
            <Image
              color={isActive ? Colors.navy04 : Colors.blue05}
              height={TAB_ICON_SIZE}
              name={tab.icon}
              type="svg"
              width={TAB_ICON_SIZE}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {t(tab.labelKey)}
            </Text>
          </AppButton>
        );
      })}
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
    padding: ScaleSize(4),
  },
  label: {
    color: Colors.blue05,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
  labelActive: {
    color: Colors.navy04,
  },
  tab: {
    alignItems: 'center',
    borderRadius: ScaleSize(11),
    flex: 1,
    flexDirection: 'row',
    gap: ScaleSize(8),
    justifyContent: 'center',
    paddingVertical: ScaleSize(11),
  },
  tabActive: {
    backgroundColor: Colors.white,
  },
});
