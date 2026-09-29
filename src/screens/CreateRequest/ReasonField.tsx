import React, { useCallback, useState } from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export const REASON_MAX_LENGTH = 500;

type Properties = {
  readonly defaultValue: string;
  /** Nhãn và gợi ý đều đổi theo loại đơn, nên không có giá trị mặc định. */
  readonly labelKey: string;
  readonly onChangeText: (reason: string) => void;
  readonly placeholderKey: string;
  /** Ô ghi chú tắt bộ đếm: nó ngắn và không bắt buộc nên đếm chỉ gây nhiễu. */
  readonly showCounter?: boolean;
  readonly testID?: string;
};

function ReasonField({
  defaultValue,
  labelKey,
  onChangeText,
  placeholderKey,
  showCounter = true,
  testID = 'CreateRequestReason',
}: Properties) {
  const { t } = useTranslation();

  const [usedLength, setUsedLength] = useState(defaultValue.length);

  const handleChangeText = useCallback(
    (next: string) => {
      if (showCounter) {
        setUsedLength(next.length);
      }
      onChangeText(next);
    },
    [onChangeText, showCounter],
  );

  return (
    <View>
      <Text style={styles.label}>{t(labelKey)}</Text>

      <TextInput
        defaultValue={defaultValue}
        maxLength={REASON_MAX_LENGTH}
        multiline
        onChangeText={handleChangeText}
        placeholder={t(placeholderKey)}
        placeholderTextColor={Colors.gray18}
        style={styles.input}
        testID={testID}
        textAlignVertical="top"
      />

      {showCounter ? (
        <Text style={styles.counter}>
          {t('create_request.reason_counter', {
            max: REASON_MAX_LENGTH,
            used: usedLength,
          })}
        </Text>
      ) : undefined}
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
