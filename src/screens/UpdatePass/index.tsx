import { Button, TextField } from '@components';
import { useUpdatePass } from '@hooks';
import { ScaleSize } from '@kits/core';
import RegisterHeader from '@screens/Authorisation/components/RegisterFlow/Header';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TEXT_COLOR = '#1A1A1A';
const DIVIDER_COLOR = '#E0E0E0';
const SEPARATOR_COLOR = '#F0F0F0';
const SEPARATOR_HEIGHT = ScaleSize(10);

const handleDismissKeyboard = () => {
  Keyboard.dismiss();
};

function UpdatePass() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    confirmPassword,
    currentPassword,
    errors,
    newPassword,
    onBack,
    onChangeConfirmPassword,
    onChangeCurrentPassword,
    onChangeNewPassword,
    onSubmit,
    valid,
  } = useUpdatePass();

  const newPasswordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handleDismissKeyboard}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <RegisterHeader onBack={onBack} showBtnBack />

      <View style={styles.titleBlock}>
        <Text style={styles.title}>{t('update_pass.title')}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.formBlock}>
        <TextField
          autoCapitalize="none"
          error={errors.currentPassword}
          iconName="lock"
          label={t('update_pass.current_label')}
          onChangeText={onChangeCurrentPassword}
          onSubmitEditing={() => newPasswordRef.current?.focus()}
          placeholder={t('update_pass.current_placeholder')}
          returnKeyType="next"
          secureTextEntry
          submitBehavior="submit"
          testID="update-pass-current"
          value={currentPassword}
        />

        <TextField
          autoCapitalize="none"
          error={errors.newPassword}
          iconName="lock"
          label={t('update_pass.new_label')}
          onChangeText={onChangeNewPassword}
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          placeholder={t('update_pass.new_placeholder')}
          ref={newPasswordRef}
          returnKeyType="next"
          secureTextEntry
          submitBehavior="submit"
          testID="update-pass-new"
          value={newPassword}
        />

        <TextField
          autoCapitalize="none"
          error={errors.confirmPassword}
          iconName="lock"
          label={t('update_pass.confirm_label')}
          onChangeText={onChangeConfirmPassword}
          onSubmitEditing={onSubmit}
          placeholder={t('update_pass.confirm_placeholder')}
          ref={confirmPasswordRef}
          returnKeyType="done"
          secureTextEntry
          testID="update-pass-confirm"
          value={confirmPassword}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.footerSeparator} />
        <Button
          disabled={!valid}
          onPress={onSubmit}
          style={styles.nextButton}
          testID="update-pass-next"
          title={t('update_pass.next')}
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
    backgroundColor: DIVIDER_COLOR,
    height: 1,
    marginVertical: ScaleSize(24),
  },
  footer: {
    bottom: ScaleSize(25),
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 9,
  },
  footerSeparator: {
    backgroundColor: SEPARATOR_COLOR,
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

export default React.memo(UpdatePass);
