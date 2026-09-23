import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export const REASON_MAX_LENGTH = 500;

type Properties = {
  readonly onChangeText: (reason: string) => void;
  readonly value: string;
};

/** Ô lý do nhiều dòng, kèm bộ đếm ký tự ở góc dưới phải. */
function ReasonField({ onChangeText, value }: Properties) {
  const { t } = useTranslation();

  return (
    <View>
      <Text style={styles.label}>{t('create_request.reason_label')}</Text>

      <TextInput
        maxLength={REASON_MAX_LENGTH}
        multiline
        onChangeText={onChangeText}
        placeholder={t('create_request.reason_placeholder')}
        placeholderTextColor={Colors.gray18}
        style={styles.input}
        testID="CreateRequestReason"
        textAlignVertical="top"
        value={value}
      />

      <Text style={styles.counter}>
        {t('create_request.reason_counter', {
          max: REASON_MAX_LENGTH,
          used: value.length,
        })}
      </Text>
    </View>
  );
}

export default React.memo(ReasonField);

const styles = StyleSheet.create({
  counter: {
    color: Colors.gray18,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(6),
    textAlign: 'right',
  },
  input: {
    backgroundColor: Colors.white,
    borderColor: Colors.gray19,
    borderRadius: ScaleSize(12),
    borderWidth: 1,
    color: Colors.navy04,
    fontSize: ScaleSize(15),
    lineHeight: ScaleSize(22),
    minHeight: ScaleSize(110),
    padding: ScaleSize(14),
  },
  label: {
    color: Colors.gray17,
    fontSize: ScaleSize(14),
    fontWeight: '600',
    marginBottom: ScaleSize(8),
  },
});
