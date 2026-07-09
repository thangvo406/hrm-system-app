import type { Ref } from 'react';
import type {
  KeyboardTypeOptions,
  ReturnKeyType,
  StyleProp,
  SubmitBehavior,
  TextInputProps,
  ViewStyle,
} from 'react-native';

import { ScaleSize } from '@kits/core';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const ERROR_FONT_SIZE = 12;
const ERROR_MARGIN_TOP = 4;
const PLACEHOLDER_COLOR = '#9E9E9E';
const TEXT_COLOR = '#1A1A1A';
const UNDERLINE_COLOR = '#9E9E9E';
const UNDERLINE_COLOR_ERROR = '#D32F2F';
const UNDERLINE_HEIGHT = ScaleSize(1.5);

type TextInputRegisterProps = {
  readonly error?: string;
  readonly keyboardType?: KeyboardTypeOptions;
  readonly maxLength?: number;
  readonly onChangeText: (text: string) => void;
  readonly onSubmitEditing?: () => void;
  readonly placeholder: string;
  readonly ref?: Ref<TextInput>;
  readonly returnKeyType?: ReturnKeyType;
  readonly secureTextEntry?: boolean;
  readonly style?: StyleProp<ViewStyle>;
  readonly submitBehavior?: SubmitBehavior;
  readonly textContentType?: TextInputProps['textContentType'];
  readonly testID: string;
  readonly textAlign?: 'left' | 'right';
  readonly value: string;
};

/**
 * Single-line underlined text input used across the register flow.
 * Owns its bottom border (which turns red when `error` is provided) and
 * renders an error message below the input. The `underlineColorAndroid`
 * is forced transparent so the wrapper's `borderBottomWidth` is visible
 * on Android (the platform paints a native underline over the parent
 * border otherwise).
 */
function TextInputRegister({
  error = undefined,
  keyboardType = 'default',
  maxLength = undefined,
  onChangeText,
  onSubmitEditing = undefined,
  placeholder,
  ref: reference = undefined,
  returnKeyType = undefined,
  secureTextEntry = false,
  style = undefined,
  submitBehavior = undefined,
  testID,
  textAlign = 'left',
  textContentType = undefined,
  value,
}: TextInputRegisterProps) {
  const hasError = error !== undefined;
  return (
    <View>
      <View
        style={[
          styles.wrapper,
          hasError ? styles.wrapperError : undefined,
          style,
        ]}
      >
        <TextInput
          keyboardType={keyboardType}
          maxLength={maxLength}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor={PLACEHOLDER_COLOR}
          ref={reference}
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry}
          style={[
            styles.input,
            textAlign === 'right' ? styles.inputRight : undefined,
          ]}
          submitBehavior={submitBehavior}
          testID={testID}
          textContentType={textContentType}
          underlineColorAndroid="transparent"
          value={value}
        />
      </View>
      {hasError ? (
        <Text style={styles.error} testID={`${testID}-error`}>
          {error}
        </Text>
      ) : undefined}
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    color: UNDERLINE_COLOR_ERROR,
    fontSize: ERROR_FONT_SIZE,
    marginTop: ERROR_MARGIN_TOP,
  },
  input: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(16),
    paddingHorizontal: 0,
    paddingVertical: ScaleSize(12),
  },
  inputRight: {
    textAlign: 'right',
  },
  wrapper: {
    borderBottomColor: UNDERLINE_COLOR,
    borderBottomWidth: UNDERLINE_HEIGHT,
  },
  wrapperError: {
    borderBottomColor: UNDERLINE_COLOR_ERROR,
  },
});

export default React.memo(TextInputRegister);
