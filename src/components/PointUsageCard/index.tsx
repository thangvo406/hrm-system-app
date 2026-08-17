import type { Ref } from 'react';
import type { TextInput } from 'react-native';

import CheckBox from '@components/CheckBox';
import TextField from '@components/TextField';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';

const ACCENT_COLOR = '#2DB34A';

export type PointUsageCardHandle = {
  readonly focus: () => void;
};

type Properties = {
  readonly onChangePointUsed: (text: number) => void;
  readonly onToggleUsePoints: () => void;
  readonly pointHolding?: number;
  readonly pointUsed: number;
  readonly ref?: Ref<PointUsageCardHandle>;
  readonly usePoints: boolean;
};

function PointUsageCard({
  onChangePointUsed,
  onToggleUsePoints,
  pointHolding,
  pointUsed,
  ref: reference,
  usePoints,
}: Properties) {
  const { t } = useTranslation();
  const [errorInputPoint, setErrorInputPoint] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [inputText, setInputText] = useState('');
  const currentWallet = useAppSelector(AccountSelector.getCurrentWallet);
  const inputReference = useRef<TextInput>(null);

  useImperativeHandle(
    reference,
    () => ({
      focus: () => {
        inputReference.current?.focus();
      },
    }),
    [],
  );

  useEffect(() => {
    const typedNumber = Number(inputText.replaceAll(/\D/g, '') || 0);
    if (typedNumber === pointUsed) {
      return;
    }
    setInputText(pointUsed ? formatCurrency(pointUsed) : '');
  }, [inputText, pointUsed]);

  const onChangePoint = (text: string) => {
    const digits = text.replaceAll(/\D/g, '');
    const newNumber = digits ? Number(digits) : 0;
    if (newNumber > (currentWallet?.pointBalance || 0)) {
      setErrorInputPoint(
        t('point_usage.max_point_error', {
          amount: formatCurrency(currentWallet?.pointBalance),
        }),
      );
      return;
    }
    setErrorInputPoint('');
    setInputText(digits ? formatCurrency(newNumber) : '');
    onChangePointUsed(newNumber);
  };

  const onFocusPoint = () => {
    setIsFocused(true);
    setInputText(pointUsed ? formatCurrency(pointUsed) : '');
  };

  const onBlurPoint = () => {
    setIsFocused(false);
    setErrorInputPoint('');
  };

  const renderPointUnit = () => (
    <Text style={styles.pointUnit}>{t('point_usage.point_unit')}</Text>
  );

  return (
    <View style={styles.card}>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
        }}
      >
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
          onChangeText={onChangePoint}
          onBlur={onBlurPoint}
          onFocus={onFocusPoint}
          placeholder=""
          ref={inputReference}
          renderRightComponent={renderPointUnit}
          returnKeyType="done"
          style={styles.pointPillText}
          testID="point-usage-input"
          value={isFocused ? inputText : formatCurrency(pointUsed)}
        />
      </View>
      {!!errorInputPoint && (
        <Text style={styles.errorMaxQuantity}>{errorInputPoint}</Text>
      )}
    </View>
  );
}

export default React.memo(PointUsageCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EFEFEF',
    borderRadius: ScaleSize(14),
    borderWidth: 1,
    paddingHorizontal: ScaleSize(18),
    paddingVertical: ScaleSize(16),
  },
  holdingLabel: {
    color: '#8A8F94',
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(4),
  },
  errorMaxQuantity: {
    color: 'red',
    textAlign: 'right',
    fontSize: ScaleSize(14),
    fontWeight: '400',
    marginTop: ScaleSize(8),
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
    gap: ScaleSize(4),
    justifyContent: 'center',
    marginBottom: 0,
    maxWidth: ScaleSize(120),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(10),
  },
  pointPillText: {
    color: Colors.white,
    flex: 0,
    flexShrink: 1,
    fontSize: ScaleSize(15),
    fontWeight: '700',
    minWidth: ScaleSize(24),
    paddingVertical: 0,
    textAlign: 'center',
  },
  pointUnit: {
    color: Colors.white,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
});
