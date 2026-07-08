import { AppButton, Button, Image, RadioButton } from '@components';
import RegisterHeader from './Header';
import TextInputRegister from './TextInputRegister';
import { useTranslation } from 'react-i18next';
import type { TextInput } from 'react-native';
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ScaleSize } from '@kits/core';
import { ValidateUtils } from '@kits/core/utils';
import AppNavigator from '@navigation/AppNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@constants';
import { formatPhoneNumber } from '@utils/common';

const BACK_ICON_SIZE = ScaleSize(24);
const ICON_CHEVRON_SIZE = ScaleSize(18);
const ICON_COLOR = '#666666';
const TEXT_COLOR = '#1A1A1A';
const PLACEHOLDER_COLOR = '#9E9E9E';
const PRIMARY_COLOR = '#5BB85C';
const PHONE_MAX_LENGTH = 13;

const OTP_MAX_LENGTH = 6;

const IDENTIFY_MAX_LENGTH = 7;
const BIRTHDAY_MAX_LENGTH = 6;
const OTP_COOLDOWN_SECONDS = 300;
const OTP_TICK_MS = 1000;
const SECONDS_PER_MINUTE = 60;
const SECONDS_PAD_LENGTH = 2;
const NAME_MAX_LENGTH = 255;

const formatCountdown = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
  const seconds = totalSeconds % SECONDS_PER_MINUTE;
  return `${minutes}:${String(seconds).padStart(SECONDS_PAD_LENGTH, '0')}`;
};

export type InputInfoValues = {
  birthday: string;
  indentify: string;
  name: string;
  otp: string;
  phone: string;
};

type InputInfoProps = {
  readonly agreed: boolean;
  readonly carrier: string;
  readonly isShowFieldName: boolean;
  readonly titleRegisterInfoKey: string;
  readonly disabled?: boolean;
  readonly onInfoChange: (field: keyof InputInfoValues, value: string) => void;
  readonly onPressCarrier: () => void;
  readonly onPressRequestOtp: (onSuccess: (isSuccess: boolean) => void) => void;
  readonly onSubmit: () => void;
  readonly onToggleAgreement: () => void;
  readonly onPressVerify: () => void;
};

/**
 * Format a phone input into `010-xxxx-xxxx`.
 * Strips non-digits, caps at 11 digits, then re-inserts dashes at the
 * correct positions so the user sees the separators as they type.
 */

const DEFAULT_INFO: InputInfoValues = {
  birthday: '',
  indentify: '',
  // name: '',
  otp: '',
  phone: '',
};

const FIELD_INPUT_INFO = {
  birthday: 'birthday',
  indentify: 'indentify',
  name: 'name',
  otp: 'otp',
  phone: 'phone',
} as const satisfies Record<keyof InputInfoValues, keyof InputInfoValues>;

const FIELD_FLOW_ORDER: readonly (keyof InputInfoValues)[] = [
  FIELD_INPUT_INFO.name,
  FIELD_INPUT_INFO.birthday,
  FIELD_INPUT_INFO.indentify,
  FIELD_INPUT_INFO.phone,
  FIELD_INPUT_INFO.otp,
];

function InputInfo({
  agreed,
  carrier,
  disabled = false,
  onInfoChange,
  onPressCarrier,
  onPressRequestOtp,
  onSubmit,
  onToggleAgreement,
  onPressVerify,
  isShowFieldName,
  titleRegisterInfoKey = 'register_flow.identity_title',
}: InputInfoProps) {
  const { t } = useTranslation();
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [countDownTime, setCountDownTime] = useState<number>(0);
  const [values, setValues] = useState<InputInfoValues>(DEFAULT_INFO);
  // const nameReference = useRef<TextInput>(null);
  const birthdayReference = useRef<TextInput>(null);
  const indentifyReference = useRef<TextInput>(null);
  const nameReference = useRef<TextInput>(null);
  const phoneReference = useRef<TextInput>(null);
  const otpReference = useRef<TextInput>(null);
  const verifiedOtp = useRef(false);
  const [enableBtnSubmit, setEnableBtnSubmit] = useState(false);
  const insset = useSafeAreaInsets();
  const fieldReferences: Record<
    keyof InputInfoValues,
    React.RefObject<TextInput | null>
  > = {
    [FIELD_INPUT_INFO.birthday]: birthdayReference,
    [FIELD_INPUT_INFO.indentify]: indentifyReference,
    [FIELD_INPUT_INFO.otp]: otpReference,
    [FIELD_INPUT_INFO.phone]: phoneReference,
  };

  useEffect(() => {
    if (otpSent) {
      otpReference.current?.focus();
    }
  }, [otpSent]);

  useEffect(() => {
    setEnableBtnSubmit(verifiedOtp.current ? agreed : false);
  }, [agreed]);

  useEffect(() => {
    if (countDownTime <= 0) return;
    const interval = setInterval(() => {
      setCountDownTime(previous => (previous <= 1 ? 0 : previous - 1));
    }, OTP_TICK_MS);
    return () => {
      clearInterval(interval);
    };
  }, [countDownTime]);

  const onRequestOtp = () => {
    if (countDownTime > 0) return;
    if (!ValidateUtils.isPhoneNumber(values.phone)) {
      AppNavigator.showSnackBar({
        message: t('authorisation.error_phone_invalid'),
        type: 'failed',
      });
      return;
    }
    if (
      values.indentify?.length < IDENTIFY_MAX_LENGTH ||
      values.birthday?.length < BIRTHDAY_MAX_LENGTH
    ) {
      let msg = '';
      if (values.indentify?.length < IDENTIFY_MAX_LENGTH) {
        msg = t('register_flow.error_identify_min', {
          min: IDENTIFY_MAX_LENGTH,
        });
      } else if (values.birthday?.length < BIRTHDAY_MAX_LENGTH) {
        msg = t('register_flow.error_birthday_min', {
          min: BIRTHDAY_MAX_LENGTH,
        });
      }
      AppNavigator.showSnackBar({
        message: msg,
        type: 'failed',
      });
      return;
    }
    onPressRequestOtp((isSuccess: boolean) => {
      if (!isSuccess) {
        setCountDownTime(0);
        return;
      }
      setCountDownTime(OTP_COOLDOWN_SECONDS);
      setOtpSent(true);
    });
  };

  const handleChange = (field: keyof InputInfoValues) => (value: string) => {
    const _value =
      field === FIELD_INPUT_INFO.phone ? value.replaceAll('-', '') : value;
    setValues(previous => ({ ...previous, [field]: _value }));
    onInfoChange(field, _value);
  };

  const _onPressVerify = () => {
    onPressVerify((isSuccess: boolean) => {
      if (isSuccess) {
        verifiedOtp.current = true;
        setEnableBtnSubmit(true);
      }
    });
  };

  const handleSubmitField = (field: keyof InputInfoValues) => (): void => {
    if (field === FIELD_INPUT_INFO.otp && isFormValid) {
      _onPressVerify();
      return;
    }
    const currentIndex = FIELD_FLOW_ORDER.indexOf(field);
    if (currentIndex === -1) {
      return;
    }
    const nextField = FIELD_FLOW_ORDER[currentIndex + 1];
    if (!nextField) {
      return;
    }
    if (nextField === FIELD_INPUT_INFO.otp && !otpSent) {
      Keyboard.dismiss();
      return;
    }
    fieldReferences[nextField].current?.focus?.();
  };

  const isFormValid =
    agreed &&
    values.birthday.trim().length == BIRTHDAY_MAX_LENGTH &&
    values.indentify.trim().length == IDENTIFY_MAX_LENGTH &&
    values.phone.trim().length > 0 &&
    values.otp.trim().length === OTP_MAX_LENGTH;

  return (
    <TouchableOpacity
      accessible={false}
      activeOpacity={1}
      onPress={() => {
        Keyboard.dismiss();
      }}
      style={styles.container}
    >
      <RegisterHeader />

      <View style={styles.identityBlock}>
        <Text style={styles.identityTitle}>{t(titleRegisterInfoKey)}</Text>

        <RadioButton
          label={t('register_flow.agree_label')}
          onPress={onToggleAgreement}
          selected={agreed}
          style={styles.agreeRow}
          testID="register-flow-agree"
        />

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.linkRow}
          testID="register-flow-terms"
        >
          <Text style={styles.linkText}>{t('register_flow.terms_of_use')}</Text>
          <Image
            color={ICON_COLOR}
            height={ICON_CHEVRON_SIZE}
            name="ic_chevron_right"
            type="svg"
            width={ICON_CHEVRON_SIZE}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.linkRow}
          testID="register-flow-carrier-terms"
        >
          <Text style={styles.linkText}>
            {t('register_flow.carrier_terms')}
          </Text>
          <Image
            color={ICON_COLOR}
            height={ICON_CHEVRON_SIZE}
            name="ic_chevron_right"
            type="svg"
            width={ICON_CHEVRON_SIZE}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.formBlock}>
        {!!isShowFieldName && (
          <TextInputRegister
            maxLength={NAME_MAX_LENGTH}
            onChangeText={handleChange(FIELD_INPUT_INFO.name)}
            onSubmitEditing={handleSubmitField(FIELD_INPUT_INFO.name)}
            placeholder={t('register_flow.name_placeholder')}
            ref={nameReference}
            returnKeyType="next"
            submitBehavior="submit"
            testID="register-flow-name"
            value={values.name}
          />
        )}

        <View style={styles.dobRow}>
          <View style={[styles.dobDateField]}>
            <TextInputRegister
              keyboardType="number-pad"
              maxLength={BIRTHDAY_MAX_LENGTH}
              onChangeText={handleChange(FIELD_INPUT_INFO.birthday)}
              onSubmitEditing={handleSubmitField(FIELD_INPUT_INFO.birthday)}
              placeholder={t('register_flow.dob_label')}
              ref={birthdayReference}
              returnKeyType="next"
              submitBehavior="submit"
              testID="register-flow-birthday1"
              value={values.birthday}
            />
          </View>

          <Text style={styles.dobSeparator}>—</Text>

          <View style={[styles.dobDateField]}>
            <TextInputRegister
              keyboardType="number-pad"
              maxLength={IDENTIFY_MAX_LENGTH}
              onChangeText={handleChange(FIELD_INPUT_INFO.indentify)}
              onSubmitEditing={handleSubmitField(FIELD_INPUT_INFO.indentify)}
              placeholder={t('register_flow.identify_label')}
              ref={indentifyReference}
              returnKeyType="next"
              secureTextEntry
              submitBehavior="submit"
              testID="register-flow-birthday2"
              textAlign="right"
              value={values.indentify}
            />
          </View>
        </View>

        <View style={styles.phoneRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPressCarrier}
            style={styles.carrierPicker}
            testID="register-flow-carrier"
          >
            <Text style={styles.carrierText}>{carrier}</Text>
            <Image
              color={ICON_COLOR}
              height={ICON_CHEVRON_SIZE}
              name="ic_chevron_down"
              type="svg"
              width={ICON_CHEVRON_SIZE}
            />
          </TouchableOpacity>

          <View style={styles.phoneField}>
            <TextInputRegister
              keyboardType="number-pad"
              maxLength={PHONE_MAX_LENGTH}
              onChangeText={handleChange(FIELD_INPUT_INFO.phone)}
              onSubmitEditing={handleSubmitField(FIELD_INPUT_INFO.phone)}
              placeholder={t('register_flow.phone_placeholder')}
              ref={phoneReference}
              returnKeyType="next"
              submitBehavior="submit"
              testID="register-flow-phone"
              value={formatPhoneNumber(values.phone)}
              style={{
                borderBottomWidth: 0,
              }}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            disabled={countDownTime > 0}
            onPress={onRequestOtp}
            style={styles.requestButton}
            testID="register-flow-request"
          >
            <Text
              style={
                countDownTime > 0
                  ? styles.requestText
                  : styles.requestTextActive
              }
            >
              {countDownTime > 0
                ? formatCountdown(countDownTime)
                : t('register_flow.request_verification')}
            </Text>
          </TouchableOpacity>
        </View>

        {otpSent ? (
          <View style={styles.otpRow}>
            <View style={styles.otpField}>
              <TextInputRegister
                keyboardType="number-pad"
                maxLength={OTP_MAX_LENGTH}
                onChangeText={handleChange(FIELD_INPUT_INFO.otp)}
                onSubmitEditing={handleSubmitField(FIELD_INPUT_INFO.otp)}
                placeholder={t('register_flow.otp_label')}
                ref={otpReference}
                returnKeyType="done"
                testID="register-flow-otp"
                value={values.otp}
                style={{
                  borderBottomWidth: 0,
                }}
              />
            </View>
            <AppButton
              style={styles.btnVerification}
              onPress={_onPressVerify}
              disabled={!isFormValid || enableBtnSubmit}
            >
              {verifiedOtp.current ? (
                <Image
                  name="ic_check"
                  type="svg"
                  color={Colors.primary}
                  width={ScaleSize(32)}
                  height={ScaleSize(32)}
                />
              ) : (
                <Text
                  style={
                    !isFormValid
                      ? [styles.requestText, { width: undefined }]
                      : styles.requestTextActive
                  }
                >
                  {t('register_flow.verification')}
                </Text>
              )}
            </AppButton>
          </View>
        ) : undefined}

        <Text style={styles.warning}>{t('register_flow.warning')}</Text>
      </View>
      <View style={[styles.footer, { bottom: insset.bottom || ScaleSize(25) }]}>
        <View style={styles.footerSeparator} />
        <Button
          disabled={!enableBtnSubmit}
          style={{
            width: '90%',
            alignSelf: 'center',
          }}
          onPress={onSubmit}
          testID="register-flow-next"
          title={t('register_flow.next')}
          type="primary"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  agreeLabel: {
    color: TEXT_COLOR,
    flex: 1,
    fontSize: ScaleSize(14),
    lineHeight: ScaleSize(20),
    marginLeft: ScaleSize(10),
  },
  agreeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: ScaleSize(6),
  },
  backButton: {
    alignItems: 'center',
    height: BACK_ICON_SIZE,
    justifyContent: 'center',
    left: ScaleSize(16),
    position: 'absolute',
    top: ScaleSize(10),
    width: BACK_ICON_SIZE,
  },
  btnVerification: {
    height: '100%',
    paddingTop: ScaleSize(12),
    alignItems: 'center',
  },
  carrierPicker: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(8),
    justifyContent: 'space-between',
    minWidth: ScaleSize(70),
    paddingBottom: ScaleSize(12),
    paddingTop: ScaleSize(14),
  },
  carrierText: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(15),
    fontWeight: '500',
  },
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  divider: {
    backgroundColor: '#F0F0F0',
    width: '100%',
    height: ScaleSize(8),
  },
  dobDateField: {
    flex: 1 / 2,
  },
  dobGenderField: {
    width: ScaleSize(64),
  },
  dobRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: ScaleSize(12),
    marginTop: ScaleSize(8),
  },
  dobSeparator: {
    color: PLACEHOLDER_COLOR,
    fontSize: ScaleSize(16),
    paddingBottom: ScaleSize(12),
  },
  footer: {
    left: 0,
    zIndex: 9,
    position: 'absolute',
    right: 0,
  },
  formBlock: {
    paddingHorizontal: ScaleSize(24),
  },
  identityBlock: {
    paddingHorizontal: ScaleSize(24),
    paddingVertical: ScaleSize(24),
  },
  identityTitle: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(22),
    fontWeight: '700',
    lineHeight: ScaleSize(30),
    marginBottom: ScaleSize(24),
  },
  linkRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: ScaleSize(6),
  },
  linkText: {
    color: TEXT_COLOR,
    flex: 1,
    fontSize: ScaleSize(14),
  },
  otpField: {
    flex: 1,
  },
  otpRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginTop: ScaleSize(12),
    borderBottomWidth: 1,
    borderBottomColor: '#9E9E9E',
  },
  phoneField: {
    flex: 1,
    marginLeft: ScaleSize(16),
  },
  phoneRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginTop: ScaleSize(24),
    borderBottomWidth: 1,
    borderBottomColor: '#9E9E9E',
  },
  requestButton: {
    marginLeft: ScaleSize(16),
    paddingBottom: ScaleSize(12),
    paddingTop: ScaleSize(12),
  },
  requestText: {
    color: PLACEHOLDER_COLOR,
    fontSize: ScaleSize(13),
    lineHeight: ScaleSize(18),
    textAlign: 'right',
    width: ScaleSize(60),
  },
  requestTextActive: {
    color: PRIMARY_COLOR,
    fontSize: ScaleSize(13),
    fontWeight: '700',
    lineHeight: ScaleSize(18),
    textAlign: 'right',
    width: ScaleSize(100),
  },
  footerSeparator: {
    width: '100%',
    height: ScaleSize(10),
    backgroundColor: '#F0F0F0',
    marginBottom: ScaleSize(30),
  },
  verifyButton: {
    marginLeft: ScaleSize(16),
    paddingBottom: ScaleSize(12),
    paddingTop: ScaleSize(12),
  },
  verifyText: {
    color: PRIMARY_COLOR,
    fontSize: ScaleSize(14),
    fontWeight: '700',
    lineHeight: ScaleSize(18),
    textAlign: 'right',
    width: ScaleSize(60),
  },
  warning: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(12),
    lineHeight: ScaleSize(18),
    marginTop: ScaleSize(24),
  },
});

export default React.memo(InputInfo);
