import AppButton from '@components/AppButton';
import CheckBox from '@components/CheckBox';
import TextField from '@components/TextField';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import { useTranslation } from 'react-i18next';
import React from 'react';

const ACCENT_COLOR = '#2DB34A';

type Properties = {
  readonly onChangePointUsed: (text: string) => void;
  readonly onToggleUsePoints: () => void;
  readonly pointHolding: number;
  readonly pointUsed: number;
  readonly usePoints: boolean;
};

function PointUsageCard({
  onChangePointUsed,
  onToggleUsePoints,
  pointHolding,
  pointUsed,
  usePoints,
}: Properties) {
  const { t } = useTranslation();

  return (
    <AppButton style={styles.card} onPress={onToggleUsePoints}>
      <CheckBox
        onPress={onToggleUsePoints}
        selected={usePoints}
        testID="point-usage-toggle"
      />

      <View style={styles.info}>
        <Text style={styles.label}>{t('point_usage.use_point')}</Text>
        <Text style={styles.holdingLabel}>
          {t('point_usage.point_holding', {
            amount: formatCurrency(pointHolding),
          })}
        </Text>
      </View>

      <TextField
        inputWrapperStyle={styles.pointPill}
        keyboardType="number-pad"
        onChangeText={onChangePointUsed}
        placeholder="0"
        style={styles.pointPillText}
        testID="point-usage-input"
        value={`${formatCurrency(pointUsed)} ${t('point_usage.point_unit')}`}
      />
    </AppButton>
  );
}

export default React.memo(PointUsageCard);

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#EFEFEF',
    borderRadius: ScaleSize(14),
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: ScaleSize(18),
    paddingVertical: ScaleSize(16),
  },
  holdingLabel: {
    color: '#8A8F94',
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(4),
  },
  info: {
    flex: 1,
    marginLeft: ScaleSize(12),
  },
  label: {
    color: '#1A1A1A',
    fontSize: ScaleSize(15),
    fontWeight: '600',
  },
  pointPill: {
    alignItems: 'center',
    backgroundColor: ACCENT_COLOR,
    borderRadius: ScaleSize(8),
    justifyContent: 'center',
    marginBottom: 0,
    maxWidth: ScaleSize(120),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(10),
  },
  pointPillText: {
    color: '#FFFFFF',
    flex: 0,
    fontSize: ScaleSize(15),
    fontWeight: '700',
    paddingVertical: 0,
    textAlign: 'center',
  },
});
