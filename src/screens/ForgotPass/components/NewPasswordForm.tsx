import { Button, Image, TextField } from '@components';
import RegisterHeader from '@screens/Authorisation/components/RegisterFlow/Header';
import imageNames from '@assets/images/names';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ScaleSize } from '@kits/core';
import { DeviceUtils } from '@kits/core/utils';
import { AppConstants } from '@constants';
import { CommonUtils } from '@utils';

const { ifAndroid } = DeviceUtils;
const { PASSWORD_MIN_LENGTH } = AppConstants;
const TEXT_COLOR = '#1A1A1A';
const SUCCESS_COLOR = '#5BB85C';
const SEPARATOR_HEIGHT = ScaleSize(10);
const SUCCESS_BANNER_DURATION = 5000;
const SUCCESS_ICON_SIZE = ScaleSize(22);

type PasswordValues = { confirmPassword: string; password: string };
type PasswordErrors = { confirmPassword?: string; password?: string };

const validateNewPassword = (
  values: PasswordValues,
  t: (key: string) => string,
): PasswordErrors => {
  const errors: PasswordErrors = {};
  if (values.password.length === 0) {
    errors.password = t('authorisation.error_password_required');
  } else if (values.password.length <= PASSWORD_MIN_LENGTH) {
    errors.password = t('authorisation.error_password_min');
  }
  if (values.confirmPassword.length === 0) {
    errors.confirmPassword = t('new_password.error_confirm_required');
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = t('new_password.error_password_mismatch');
  }
  return errors;
};

type NewPassFormProps = {
  readonly disabled?: boolean;
  readonly onSubmit: (data: {
    password: string;
    confirmPassword: string;
  }) => void;
};

function NewPassForm({ disabled = false, onSubmit }: NewPassFormProps) {
  const { t } = useTranslation();
  const confirmPasswordRef = useRef<TextInput>(null);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [touched, setTouched] = useState<{
    confirmPassword?: boolean;
    password?: boolean;
  }>({});
  const [successVisible, setSuccessVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessVisible(false);
    }, SUCCESS_BANNER_DURATION);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const { valid, visible } = CommonUtils.computeFormAuthErrors(
    { confirmPassword, password },
    touched,
    validateNewPassword,
    t,
  );

  const onChangePassword = (value: string) => {
    setPassword(value);
    setTouched(previous => ({ ...previous, password: true }));
  };

  const onChangeConfirmPassword = (value: string) => {
    setConfirmPassword(value);
    setTouched(previous => ({ ...previous, confirmPassword: true }));
  };

  const handleSubmit = () => {
    setTouched({ confirmPassword: true, password: true });
    if (!valid) return;
    onSubmit({ confirmPassword, password });
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={Keyboard.dismiss}
    >
      <RegisterHeader />

      <View style={styles.titleBlock}>
        <Text style={styles.title}>{t('new_password.title')}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.formBlock}>
        <TextField
          autoCapitalize="none"
          error={visible.password}
          iconName="lock"
          label={t('new_password.password_label')}
          onChangeText={onChangePassword}
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          placeholder={t('new_password.password_placeholder')}
          returnKeyType="next"
          secureTextEntry
          submitBehavior="submit"
          testID="new-pass-password"
          value={password}
        />

        <TextField
          autoCapitalize="none"
          error={visible.confirmPassword}
          iconName="lock"
          label={t('new_password.confirm_label')}
          onChangeText={onChangeConfirmPassword}
          placeholder={t('new_password.confirm_placeholder')}
          ref={confirmPasswordRef}
          onSubmitEditing={() => {
            if (!(disabled || !valid)) {
              handleSubmit();
            }
          }}
          returnKeyType="done"
          secureTextEntry
          testID="new-pass-confirm"
          value={confirmPassword}
        />
      </View>

      {successVisible ? (
        <View pointerEvents="none" style={styles.successBanner}>
          <View style={styles.successIconWrapper}>
            <Image
              height={SUCCESS_ICON_SIZE}
              name={imageNames.ic_info_white}
              width={SUCCESS_ICON_SIZE}
            />
          </View>
          <Text style={styles.successMessage}>
            {t('new_password.verification_success')}
          </Text>
        </View>
      ) : undefined}

      <View style={styles.footer}>
        <View style={styles.footerSeparator} />
        <Button
          disabled={disabled || !valid}
          onPress={handleSubmit}
          style={styles.nextButton}
          testID="new-pass-next"
          title={t('new_password.next')}
          type="primary"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  divider: {
    backgroundColor: '#E0E0E0',
    height: 1,
    marginVertical: ScaleSize(24),
  },
  footer: {
    bottom: ifAndroid(ScaleSize(25), 0),
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 9,
  },
  footerSeparator: {
    backgroundColor: '#F0F0F0',
    height: SEPARATOR_HEIGHT,
    marginBottom: ScaleSize(24),
    width: '100%',
  },
  formBlock: {
    paddingHorizontal: ScaleSize(24),
  },
  nextButton: {
    alignSelf: 'center',
    width: '90%',
  },
  successBanner: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: SUCCESS_COLOR,
    borderRadius: ScaleSize(28),
    flexDirection: 'row',
    marginTop: ScaleSize(24),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(10),
  },
  successIconWrapper: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: ScaleSize(14),
    height: ScaleSize(28),
    justifyContent: 'center',
    marginRight: ScaleSize(10),
    width: ScaleSize(28),
  },
  successMessage: {
    color: '#FFFFFF',
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
  title: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(22),
    fontWeight: '700',
    lineHeight: ScaleSize(30),
  },
  titleBlock: {
    paddingHorizontal: ScaleSize(24),
    paddingVertical: ScaleSize(24),
  },
});

export default React.memo(NewPassForm);
