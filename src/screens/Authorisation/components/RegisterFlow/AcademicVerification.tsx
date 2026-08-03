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
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Colors } from '@constants';
import debounce from 'lodash/debounce';
import { formatTime } from '@utils/date';

const RESEND_COLOR = '#0A7340';

type AcademicVerificationProps = {
  readonly mailAcademic: string;
  readonly isVerifiedEmailAcademic: boolean;
  readonly emailExpiresIn: number;
  readonly timeResendOtpVerifyEmail: number;
  readonly onResendEmailAcademic: () => void;
  readonly onOTPEmailAcademicExpired: (callback: any) => void;
  readonly onReEnterEmailAcademic: () => void;
  readonly onSubmit: () => void;
  readonly onPressVerifyEmailAcademic: (value: string) => void;
};

const DEFAULT_EXPIRED_OTP = 300;
const MS_PER_SECOND = 1000;

// `expiresIn` is provided in milliseconds; the countdown state is in seconds.
const toSeconds = (ms: number) => Math.ceil((ms || 0) / MS_PER_SECOND);

function ResendOTP({ expiresIn, onResend, ref }: any) {
  const { t } = useTranslation();
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    toSeconds(expiresIn),
  );
  const interval = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );
  const [isAvailable, setAvailable] = useState(false);

  const start = (ms: number) => {
    setRemainingSeconds(toSeconds(ms));
    setAvailable(false);
    clearInterval(interval.current);
    interval.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval.current);
          setAvailable(true);
          return 0;
        }
        return prev - 1;
      });
    }, MS_PER_SECOND);
  };

  useEffect(() => {
    start(expiresIn);
    return () => {
      clearInterval(interval.current);
    };
  }, [expiresIn]);

  useImperativeHandle<TCounterRef, TCounterRef>(ref, () => ({
    restart: newExpiresIn => start(newExpiresIn ?? expiresIn),
  }));
  return (
    <AppButton onPress={onResend} disabled={remainingSeconds > 0}>
      <Text
        style={[
          styles.secondText,
          { color: Colors.gray1 },
          isAvailable ? styles.textAvailable : undefined,
        ]}
      >
        {t('academic_verification.resend_email')}
        {remainingSeconds > 0 &&
          ` ${t('common.display_time', { time: formatTime(remainingSeconds) })}`}
      </Text>
    </AppButton>
  );
}

function AcademicVerification({
  mailAcademic,
  onResendEmailAcademic,
  onReEnterEmailAcademic,
  isVerifiedEmailAcademic,
  timeResendOtpVerifyEmail,
  emailExpiresIn,
  onPressVerifyEmailAcademic,
  onSubmit,
  onOTPEmailAcademicExpired,
}: AcademicVerificationProps) {
  const { t } = useTranslation();
  const [otpValue, setOtpValue] = useState('');
  const counterRef = useRef<TCounterRef>(null);
  const resendOtpRef = useRef<TCounterRef>(null);
  const _onPressVerifyEmailAcademic = () => {
    if (otpValue?.length == 6) {
      onPressVerifyEmailAcademic?.(otpValue);
    }
  };

  const _onResend = () => {
    onResendEmailAcademic?.();
    resendOtpRef.current?.restart();
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
          expiresIn={toSeconds(emailExpiresIn)}
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
              {t('academic_verification.re_enter_email')}
            </Text>
          </TouchableOpacity>
          <Text style={styles.secondText}>{`  |  `}</Text>
          <ResendOTP
            ref={resendOtpRef}
            expiresIn={timeResendOtpVerifyEmail}
            onResend={_onResend}
          />
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
    // textDecorationStyle: 'solid',
    // textDecorationLine: 'underline',
  },
  textAvailable: {
    color: Colors.primary,
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
