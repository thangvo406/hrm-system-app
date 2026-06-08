import type { IconName } from '@assets/icons';
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
  readonly iconName: IconName;
  readonly keyboardType?: KeyboardTypeOptions;
  readonly label: string;
  readonly onChangeText: (text: string) => void;
  readonly placeholder: string;
  readonly secureTextEntry?: boolean;
  readonly testID?: string;
  readonly value: string;
};

function TextField({
  autoCapitalize = 'sentences',
  iconName,
  keyboardType = 'default',
  label,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  testID = undefined,
  value,
}: TextFieldProps) {
  const [secure, setSecure] = useState(secureTextEntry);

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
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
          placeholder={placeholder}
          placeholderTextColor={PLACEHOLDER_COLOR}
          secureTextEntry={secure}
          style={styles.input}
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
    </View>
  );
}

const styles = StyleSheet.create({
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
  label: {
    color: '#303030',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
});

export default React.memo(TextField);
