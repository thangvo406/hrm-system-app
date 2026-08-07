import AppButton from '@components/AppButton';
import Image from '@components/Image';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

type Properties = {
  readonly label: string;
  readonly value: string;
  readonly onPressRefresh: () => void;
};
const REFRESH_ICON_SIZE = ScaleSize(15);

function ValidityMeter({ label, value, onPressRefresh }: Properties) {
  const { t } = useTranslation();
  return (
    <View style={styles.meter}>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          gap: ScaleSize(3),
          justifyContent: 'center',
        }}
      >
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <AppButton
        onPress={onPressRefresh}
        style={styles.refreshButton}
        testID="qr-code-viewer-refresh"
      >
        <Image
          color={Colors.green08}
          height={REFRESH_ICON_SIZE}
          name="ic_refresh"
          type="svg"
          width={REFRESH_ICON_SIZE}
        />
        <Text style={styles.refreshLabel}>{t('qr_voucher.refresh')}</Text>
      </AppButton>
    </View>
  );
}

export default React.memo(ValidityMeter);

const styles = StyleSheet.create({
  label: {
    color: Colors.green08,
    fontSize: ScaleSize(12),
    letterSpacing: ScaleSize(0.3),
  },
  meter: {
    alignItems: 'center',
    backgroundColor: Colors.green06,
    borderRadius: ScaleSize(18),
    justifyContent: 'center',
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(14),
    marginTop: ScaleSize(15),
  },
  readout: {
    alignItems: 'center',
  },
  refreshButton: {
    alignItems: 'center',
    borderRadius: ScaleSize(28),
    borderWidth: 1,
    borderColor: Colors.green08,
    flexDirection: 'row',
    gap: ScaleSize(10),
    justifyContent: 'center',
    marginTop: ScaleSize(8),
    paddingVertical: ScaleSize(4),
    paddingHorizontal: ScaleSize(14),
  },
  refreshLabel: {
    color: Colors.green08,
    fontSize: ScaleSize(15),
    fontWeight: 'bold',
    letterSpacing: ScaleSize(0.2),
  },
  value: {
    color: Colors.green01,
    fontSize: ScaleSize(12),
    fontVariant: ['tabular-nums'],
    // fontWeight: '800',
    fontWeight: '700',
    letterSpacing: ScaleSize(-0.5),
    // marginTop: ScaleSize(2),
  },
});
