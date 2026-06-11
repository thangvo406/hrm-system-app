import type { IconName } from '@assets/icons';
import type { Ref } from 'react';
import type { KeyboardTypeOptions, TextInputProps } from 'react-native';

import Image from '@components/Image';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const ICON_SIZE = 20;
const ICON_COLOR = '#9E9E9E';
const PLACEHOLDER_COLOR = '#9E9E9E';

type TextFieldProps = {
  readonly autoCapitalize?: TextInputProps['autoCapitalize'];
  readonly error?: string;
  readonly iconName: IconName;
  readonly keyboardType?: KeyboardTypeOptions;
  readonly label: string;
  readonly onChangeText: (text: string) => void;
  readonly onSubmitEditing?: TextInputProps['onSubmitEditing'];
  readonly placeholder: string;
  readonly ref?: Ref<TextInput>;
  readonly returnKeyType?: TextInputProps['returnKeyType'];
  readonly secureTextEntry?: boolean;
  readonly submitBehavior?: TextInputProps['submitBehavior'];
  readonly testID?: string;
  readonly value?: string;
};

function TextField({
  autoCapitalize = 'sentences',
  error = undefined,
  iconName,
  keyboardType = 'default',
  label,
  onChangeText,
  onSubmitEditing = undefined,
  placeholder,
  ref: reference = undefined,
  returnKeyType = undefined,
  secureTextEntry = false,
  submitBehavior = undefined,
  testID = undefined,
  value,
}: TextFieldProps) {
  const [secure, setSecure] = useState(secureTextEntry);
  const hasError = error !== undefined;

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, hasError && styles.inputWrapperError]}>
        <Image
          color={ICON_COLOR}
          height={ICON_SIZE}
          name={iconName}
          type="svg"
          width={ICON_SIZE}
        />
        <TextInput
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor={PLACEHOLDER_COLOR}
          ref={reference}
          returnKeyType={returnKeyType}
          secureTextEntry={secure}
          style={styles.input}
          submitBehavior={submitBehavior}
          testID={testID}
          value={value}
        />
        {secureTextEntry ? (
          <TouchableOpacity
            onPress={() => {
              setSecure(previous => !previous);
            }}
            testID={testID ? `${testID}-toggle` : undefined}
          >
            <Image
              color={ICON_COLOR}
              height={ICON_SIZE}
              name={secure ? 'eye' : 'eye-off'}
              type="svg"
              width={ICON_SIZE}
            />
          </TouchableOpacity>
        ) : undefined}
      </View>
      {hasError ? (
        <Text
          style={styles.error}
          testID={testID ? `${testID}-error` : undefined}
        >
          {error}
        </Text>
      ) : undefined}
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    color: '#D32F2F',
    fontSize: 12,
    marginBottom: 8,
    marginTop: -2,
  },
  input: {
    color: '#303030',
    flex: 1,
    fontSize: 15,
    paddingVertical: 11,
  },
  inputWrapper: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 6,
    paddingHorizontal: 14,
  },
  inputWrapperError: {
    borderColor: '#D32F2F',
  },
  label: {
    color: '#303030',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
});

export default React.memo(TextField);
