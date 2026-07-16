import type { IconName } from '@assets/icons';
import type { JSX, Ref } from 'react';
import type {
  KeyboardTypeOptions,
  TextInputProps,
  ViewStyle,
} from 'react-native';

import Image from '@components/Image';
import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import imageNames from '@assets/images/names';
import { ScaleSize } from '@kits/core';
import { Colors } from '@constants';

const ICON_SIZE = 20;
const ICON_COLOR = '#9E9E9E';
const PLACEHOLDER_COLOR = '#9E9E9E';

type TextFieldProps = {
  readonly autoCapitalize?: TextInputProps['autoCapitalize'];
  readonly defaultValue?: string;
  readonly error?: string;
  readonly iconName: IconName;
  readonly keyboardType?: KeyboardTypeOptions;
  readonly label?: string;
  readonly onChangeText: (text: string) => void;
  readonly renderRightComponent?: () => JSX.Element;
  readonly onSubmitEditing?: TextInputProps['onSubmitEditing'];
  readonly placeholder: string;
  readonly ref?: Ref<TextInput>;
  readonly returnKeyType?: TextInputProps['returnKeyType'];
  readonly secureTextEntry?: boolean;
  readonly showClear?: boolean;
  readonly submitBehavior?: TextInputProps['submitBehavior'];
  readonly testID?: string;
  readonly value?: string;
  readonly containerStyle?: ViewStyle;
} & TextInputProps;

function TextField({
  autoCapitalize = 'sentences',
  defaultValue = undefined,
  editable = true,
  error = undefined,
  iconName,
  keyboardType = 'default',
  label = '',
  onChangeText,
  onSubmitEditing = undefined,
  placeholder,
  ref: reference = undefined,
  returnKeyType = undefined,
  secureTextEntry = false,
  showClear = false,
  submitBehavior = undefined,
  testID = undefined,
  renderRightComponent = undefined,
  value = undefined,
  containerStyle = undefined,
  ...textInputProps
}: TextFieldProps) {
  const [secure, setSecure] = useState(secureTextEntry);
  const hasError = error !== undefined;
  const textInputRef = useRef(null);
  const fakeValue = useRef('');

  const _onChangeText = (text: string) => {
    fakeValue.current = text;
    onChangeText?.(text);
  };
  const getRef = () => {
    return reference || textInputRef.current;
  };

  return (
    <View style={containerStyle}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          !editable && styles.inputWrapperEditable,
          hasError && styles.inputWrapperError,
        ]}
      >
        {!!iconName && (
          <Image
            color={ICON_COLOR}
            height={ICON_SIZE}
            name={iconName}
            type="svg"
            width={ICON_SIZE}
          />
        )}
        <TextInput
          {...textInputProps}
          autoCapitalize={autoCapitalize}
          defaultValue={defaultValue}
          editable={editable}
          keyboardType={keyboardType}
          onChangeText={_onChangeText}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor={PLACEHOLDER_COLOR}
          ref={reference || textInputRef}
          returnKeyType={returnKeyType}
          secureTextEntry={secure}
          style={styles.input}
          submitBehavior={submitBehavior}
          testID={testID}
          value={value}
        />
        {showClear && !!fakeValue.current ? (
          <TouchableOpacity
            hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
            onPress={() => {
              _onChangeText('');
              getRef()?.clear();
            }}
            testID={testID ? `${testID}-clear` : undefined}
          >
            <Image
              name={imageNames.ic_close_gray}
              width={ScaleSize(16)}
              height={ScaleSize(16)}
            />
          </TouchableOpacity>
        ) : undefined}
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
        {renderRightComponent?.()}
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
    fontSize: ScaleSize(12),
    marginBottom: ScaleSize(8),
    marginTop: ScaleSize(-2),
  },
  input: {
    color: '#303030',
    flex: 1,
    fontSize: ScaleSize(15),
    paddingVertical: ScaleSize(11),
  },
  inputWrapper: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    borderRadius: ScaleSize(12),
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: ScaleSize(6),
    paddingHorizontal: ScaleSize(14),
  },
  inputWrapperEditable: {
    backgroundColor: Colors.gray3,
  },
  inputWrapperError: {
    borderColor: '#D32F2F',
  },
  clearButton: {
    color: '#9E9E9E',
    fontSize: ScaleSize(18),
    lineHeight: ScaleSize(20),
  },
  label: {
    color: '#303030',
    fontSize: ScaleSize(14),
    fontWeight: '600',
    marginBottom: ScaleSize(6),
    marginTop: ScaleSize(10),
  },
});

export default React.memo(TextField);
