import { AppButton, Button, Counter, TextField } from '@components';
import RegisterHeader from './Header';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import React from 'react';

const RESEND_COLOR = '#0A7340';

type AcademicVerificationProps = {
  readonly mailAcademic: string;
  readonly onOtpEmailAcademicChanged: (text: string) => void;
  readonly onResendEmailAcademic: () => void;
  readonly onReEnterEmailAcademic: () => void;
};

function AcademicVerification({
  mailAcademic,
  onOtpEmailAcademicChanged,
  onResendEmailAcademic,
  onReEnterEmailAcademic,
}: AcademicVerificationProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <RegisterHeader />
      <View style={styles.content}>
        <Text style={styles.title}>{t('academic_verification.title')}</Text>
        <Text style={styles.subtitle}>
          {t('academic_verification.subtitle')}
        </Text>
        <Text style={styles.sentMessage}>
          {t('academic_verification.sent_message', { email: mailAcademic })}
        </Text>
        <TextField
          autoCapitalize="none"
          // error={errors.email}
          iconName="email"
          keyboardType="number-pad"
          // label={t('authorisation.email_label')}
          defaultValue=""
          onChangeText={onOtpEmailAcademicChanged}
          // onSubmitEditing={() => passwordReference.current?.focus()}
          placeholder={t('academic_verification.otp_placeholder')}
          renderRightComponent={() => (
            <AppButton>
              <Text>{t('academic_verification.verify_action')}</Text>
            </AppButton>
          )}
          // returnKeyType="next"
          submitBehavior="submit"
          // testID="auth-email-input"
        />

        <Counter expiresIn={300} desc="academic_verification.time_remaining" />

        <Button
          title={t('academic_verification.submit')}
          type="primary"
          style={styles.submitButton}
        />

        <View style={styles.linkRow}>
          <TouchableOpacity onPress={onResendEmailAcademic}>
            <Text style={styles.secondText}>
              {t('academic_verification.resend_email')}
            </Text>
          </TouchableOpacity>
          <Text style={styles.secondText}>{`  |  `}</Text>
          <TouchableOpacity onPress={onReEnterEmailAcademic}>
            <Text style={styles.secondText}>
              {t('academic_verification.re_enter_email')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  secondText: {
    fontSize: ScaleSize(12),
    color: '#99A1AF',
  },
  content: {
    flex: 1,
    paddingHorizontal: ScaleSize(24),
    paddingTop: ScaleSize(24),
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  sentMessage: {
    color: RESEND_COLOR,
    fontSize: ScaleSize(13),
    marginBottom: ScaleSize(24),
    marginTop: ScaleSize(60),
  },
  submitButton: {
    marginVertical: ScaleSize(30),
  },
  subtitle: {
    color: '#4B5563',
    fontSize: ScaleSize(14),
    marginTop: ScaleSize(18),
  },
  title: {
    color: '#111827',
    fontSize: ScaleSize(24),
    fontWeight: '700',
  },
});

export default React.memo(AcademicVerification);
