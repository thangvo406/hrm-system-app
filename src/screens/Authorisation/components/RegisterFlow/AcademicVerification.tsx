import {
  AppButton,
  Button,
  Counter,
  Image,
  TextField,
  TCounterRef,
} from '@components';
import RegisterHeader from './Header';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import React, { useRef, useState } from 'react';
import { Colors } from '@constants';
import { debounce } from 'lodash';

const RESEND_COLOR = '#0A7340';

type AcademicVerificationProps = {
  readonly mailAcademic: string;
  readonly isVerifiedEmailAcademic: boolean;
  readonly onResendEmailAcademic: () => void;
  readonly onOTPEmailAcademicExpired: (callback: any) => void;
  readonly onReEnterEmailAcademic: () => void;
  readonly onSubmit: () => void;
  readonly onPressVerifyEmailAcademic: (value: string) => void;
};

const DEFAULT_EXPIRED_OTP = 300;

function AcademicVerification({
  mailAcademic,
  onResendEmailAcademic,
  onReEnterEmailAcademic,
  isVerifiedEmailAcademic,
  onPressVerifyEmailAcademic,
  onSubmit,
  onOTPEmailAcademicExpired,
}: AcademicVerificationProps) {
  const { t } = useTranslation();
  const [otpValue, setOtpValue] = useState('');
  const counterRef = useRef<TCounterRef>(null);
  const _onPressVerifyEmailAcademic = () => {
    if (otpValue?.length == 6) {
      onPressVerifyEmailAcademic?.(otpValue);
    }
  };

  const onOTPExpired = () => {
    onOTPEmailAcademicExpired?.(() => {
      counterRef.current?.restart(DEFAULT_EXPIRED_OTP);
    });
  };

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
          iconName="ic_otp_placeholder"
          keyboardType="number-pad"
          maxLength={6}
          // label={t('authorisation.email_label')}
          defaultValue=""
          onChangeText={debounce(setOtpValue, 350)}
          onSubmitEditing={_onPressVerifyEmailAcademic}
          placeholder={t('academic_verification.otp_placeholder')}
          renderRightComponent={() => (
            <AppButton
              disabled={isVerifiedEmailAcademic}
              onPress={_onPressVerifyEmailAcademic}
            >
              {isVerifiedEmailAcademic ? (
                <Image
                  name="ic_check"
                  type="svg"
                  color={Colors.primary}
                  width={ScaleSize(32)}
                  height={ScaleSize(32)}
                />
              ) : (
                <Text style={styles.textVerify}>
                  {t('academic_verification.verify_action')}
                </Text>
              )}
            </AppButton>
          )}
          // returnKeyType="next"
          submitBehavior="submit"
          // testID="auth-email-input"
        />

        <Counter
          ref={counterRef}
          expiresIn={DEFAULT_EXPIRED_OTP}
          onOTPExpired={onOTPExpired}
          desc="academic_verification.time_remaining"
        />

        <Button
          title={t('academic_verification.submit')}
          type="primary"
          onPress={onSubmit}
          disabled={!isVerifiedEmailAcademic}
          style={styles.submitButton}
        />

        <View style={styles.linkRow}>
          <TouchableOpacity onPress={onReEnterEmailAcademic}>
            <Text style={styles.secondText}>
              {t('academic_verification.resend_email')}
            </Text>
          </TouchableOpacity>
          <Text style={styles.secondText}>{`  |  `}</Text>
          <TouchableOpacity onPress={onResendEmailAcademic}>
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
    color: Colors.primary,
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
  },
  textVerify: {
    color: Colors.primary,
    fontWeight: 'bold',
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
