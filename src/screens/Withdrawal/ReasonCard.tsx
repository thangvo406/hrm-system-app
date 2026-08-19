import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const REASON_MAX_LENGTH = 200;
const INPUT_MIN_HEIGHT = ScaleSize(96);

type Properties = {
  readonly maxLength?: number;
  readonly onChangeText: (value: string) => void;
};

function ReasonCard({
  maxLength = REASON_MAX_LENGTH,
  onChangeText,
}: Properties) {
  const { t } = useTranslation();
  const [charCount, setCharCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const onChangeReason = (value: string) => {
    setCharCount(value.length);
    onChangeText(value);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {t('withdrawal.reason_title')}
        <Text style={styles.optional}>
          {` ${t('withdrawal.reason_optional')}`}
        </Text>
      </Text>
      <Text style={styles.desc}>{t('withdrawal.reason_desc')}</Text>

      <View style={[styles.inputBox, isFocused && styles.inputBoxFocused]}>
        <TextInput
          maxLength={maxLength}
          multiline
          onBlur={() => setIsFocused(false)}
          onChangeText={onChangeReason}
          onFocus={() => setIsFocused(true)}
          placeholder={t('withdrawal.reason_placeholder')}
          placeholderTextColor={Colors.gray18}
          style={styles.input}
          testID="withdrawal-reason"
          textAlignVertical="top"
        />
        <Text style={styles.counter} testID="withdrawal-reason-counter">
          {`${charCount}/${maxLength}`}
        </Text>
      </View>
    </View>
  );
}

export default React.memo(ReasonCard);

const styles = StyleSheet.create({
  card: {
    borderColor: Colors.gray07,
    borderRadius: ScaleSize(16),
    borderWidth: 1,
    marginTop: ScaleSize(20),
    paddingHorizontal: ScaleSize(18),
    paddingVertical: ScaleSize(18),
  },
  counter: {
    alignSelf: 'flex-end',
    color: Colors.gray08,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(4),
  },
  desc: {
    color: Colors.gray17,
    fontSize: ScaleSize(13),
    lineHeight: ScaleSize(18),
    marginTop: ScaleSize(4),
  },
  input: {
    color: Colors.black01,
    fontSize: ScaleSize(15),
    lineHeight: ScaleSize(21),
    minHeight: INPUT_MIN_HEIGHT,
    padding: 0,
  },
  inputBox: {
    borderColor: Colors.gray07,
    borderRadius: ScaleSize(12),
    borderWidth: 1,
    marginTop: ScaleSize(12),
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(12),
  },
  inputBoxFocused: {
    borderColor: Colors.primary,
  },
  optional: {
    color: Colors.gray17,
    fontSize: ScaleSize(13),
    fontWeight: '500',
  },
  title: {
    color: Colors.black01,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
});
