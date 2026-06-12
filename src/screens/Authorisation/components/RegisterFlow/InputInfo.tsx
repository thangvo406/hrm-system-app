import { Button, Image } from '@components';
import imageNames from '@assets/images/names';
import TextInputRegister from './TextInputRegister';
import { useTranslation } from 'react-i18next';
import type { TextInput } from 'react-native';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ScaleSize } from '@kits/core';
import { DeviceUtils } from '@kits/core/utils';
const { ifAndroid } = DeviceUtils;
const BANNER_HEIGHT = ScaleSize(30);
const BANNER_WIDTH = ScaleSize(68);
const BACK_ICON_SIZE = ScaleSize(24);
const ICON_CHEVRON_SIZE = ScaleSize(18);
const ICON_RADIO_SIZE = ScaleSize(20);
const ICON_COLOR = '#666666';
const TEXT_COLOR = '#1A1A1A';
const PLACEHOLDER_COLOR = '#9E9E9E';
const PHONE_MAX_LENGTH = 13;
const PHONE_AREA_CODE_LENGTH = 3;
const PHONE_MIDDLE_LENGTH = 4;
const PHONE_LAST_LENGTH = 4;
const PHONE_MAX_DIGITS = 11;
const OTP_MAX_LENGTH = 6;

export type InputInfoValues = {
  birthday: string;
  carrier: string;
  indentify: string;
  name: string;
  otp: string;
  phone: string;
};

export type InputInfoInitialValues = Partial<
  { agreed?: boolean; otpSent?: boolean } & InputInfoValues
>;

type InputInfoProps = {
  readonly disabled?: boolean;
  readonly initialValues?: InputInfoInitialValues;
  readonly onBack?: () => void;
  readonly onInfoChange: (field: keyof InputInfoValues, value: string) => void;
  readonly onInfoMetaChange?: (
    field: 'agreed' | 'otpSent',
    value: boolean,
  ) => void;
  readonly onPressRequestOtp: (onSuccess: () => void) => void;
  readonly onSubmit: () => void;
};

const CARRIERS = ['SKT', 'KT', 'LGU+'];
const IDENTIFY_MAX_LENGTH = 6;
const BIRTHDAY_MAX_LENGTH = 6;

/**
 * Format a phone input into `010-xxxx-xxxx`.
 * Strips non-digits, caps at 11 digits, then re-inserts dashes at the
 * correct positions so the user sees the separators as they type.
 */
const formatPhoneNumber = (input: string): string => {
  const digits = input.replaceAll(/\D/g, '').slice(0, PHONE_MAX_DIGITS);
  const area = digits.slice(0, PHONE_AREA_CODE_LENGTH);
  if (digits.length <= PHONE_AREA_CODE_LENGTH) {
    return area;
  }
  const middle = digits.slice(
    PHONE_AREA_CODE_LENGTH,
    PHONE_AREA_CODE_LENGTH + PHONE_MIDDLE_LENGTH,
  );
  if (digits.length <= PHONE_AREA_CODE_LENGTH + PHONE_MIDDLE_LENGTH) {
    return `${area}-${middle}`;
  }
  const last = digits.slice(
    PHONE_AREA_CODE_LENGTH + PHONE_MIDDLE_LENGTH,
    PHONE_AREA_CODE_LENGTH + PHONE_MIDDLE_LENGTH + PHONE_LAST_LENGTH,
  );
  return `${area}-${middle}-${last}`;
};

const DEFAULT_INFO: InputInfoValues = {
  birthday: '',
  carrier: 'SKT',
  indentify: '',
  name: '',
  otp: '',
  phone: '',
};

const buildInitialValues = (
  initial: InputInfoInitialValues | undefined,
): InputInfoValues => ({
  ...DEFAULT_INFO,
  ...initial,
});

function InputInfo({
  disabled = false,
  initialValues = undefined,
  onBack = undefined,
  onInfoChange,
  onInfoMetaChange = undefined,
  onPressRequestOtp,
  onSubmit,
}: InputInfoProps) {
  const { t } = useTranslation();
  const [agreed, setAgreed] = useState<boolean>(initialValues?.agreed ?? false);
  const [showCarriers, setShowCarriers] = useState(false);
  const [otpSent, setOtpSent] = useState<boolean>(
    initialValues?.otpSent ?? false,
  );
  const [values, setValues] = useState<InputInfoValues>(() =>
    buildInitialValues(initialValues),
  );
  const otpReference = useRef<TextInput>(null);

  const updateAgreed = (value: boolean) => {
    setAgreed(value);
    onInfoMetaChange?.('agreed', value);
  };

  const updateOtpSent = (value: boolean) => {
    setOtpSent(value);
    onInfoMetaChange?.('otpSent', value);
  };

  useEffect(() => {
    if (otpSent) {
      otpReference.current?.focus();
    }
  }, [otpSent]);

  const handleChange = (field: keyof InputInfoValues) => (value: string) => {
    setValues(previous => ({ ...previous, [field]: value }));
    onInfoChange(field, value);
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setValues(previous => ({ ...previous, phone: formatted }));
    onInfoChange('phone', formatted);
  };

  const isFormValid =
    agreed &&
    values.birthday.trim().length == BIRTHDAY_MAX_LENGTH &&
    values.indentify.trim().length == IDENTIFY_MAX_LENGTH &&
    values.phone.trim().length > 0 &&
    values.otp.trim().length === OTP_MAX_LENGTH;

  return (
    <Pressable
      accessible={false}
      onPress={() => {
        Keyboard.dismiss();
      }}
      style={styles.container}
    >
      <View style={styles.header}>
        {onBack ? (
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={{
              bottom: 12,
              left: 12,
              right: 12,
              top: 12,
            }}
            onPress={onBack}
            style={styles.backButton}
            testID="register-flow-back"
          >
            <Image
              height={BACK_ICON_SIZE}
              name={imageNames.ic_arrow_left_gray}
              width={BACK_ICON_SIZE}
            />
          </TouchableOpacity>
        ) : undefined}
        <Image
          height={BANNER_HEIGHT}
          name={imageNames.ic_logo_banner}
          width={BANNER_WIDTH}
        />
      </View>

      <View style={styles.identityBlock}>
        <Text style={styles.identityTitle}>
          {t('register_flow.identity_title')}
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            updateAgreed(!agreed);
          }}
          hitSlop={{
            bottom: 10,
            left: 10,
            right: 10,
            top: 10,
          }}
          style={styles.agreeRow}
          testID="register-flow-agree"
        >
          <Image
            color={TEXT_COLOR}
            height={ICON_RADIO_SIZE}
            name={agreed ? 'ic_radio_selected' : 'ic_radio_unselected'}
            type="svg"
            width={ICON_RADIO_SIZE}
          />
          <Text style={styles.agreeLabel}>
            {t('register_flow.agree_label')}
          </Text>
        </TouchableOpacity>

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
        <View style={styles.dobRow}>
          <View style={[styles.dobDateField]}>
            <TextInputRegister
              keyboardType="number-pad"
              maxLength={BIRTHDAY_MAX_LENGTH}
              onChangeText={handleChange('birthday')}
              placeholder={t('register_flow.dob_label')}
              testID="register-flow-birthday1"
              value={values.birthday}
            />
          </View>

          <Text style={styles.dobSeparator}>—</Text>

          <View style={[styles.dobDateField]}>
            <TextInputRegister
              keyboardType="number-pad"
              maxLength={IDENTIFY_MAX_LENGTH}
              onChangeText={handleChange('indentify')}
              placeholder={t('register_flow.identify_label')}
              secureTextEntry
              testID="register-flow-birthday2"
              textAlign="right"
              value={values.indentify}
            />
          </View>
        </View>

        <View style={styles.phoneRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setShowCarriers(previous => !previous);
            }}
            style={styles.carrierPicker}
            testID="register-flow-carrier"
          >
            <Text style={styles.carrierText}>{values.carrier}</Text>
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
              onChangeText={handlePhoneChange}
              placeholder={t('register_flow.phone_placeholder')}
              testID="register-flow-phone"
              value={values.phone}
            />
          </View>

          {otpSent ? (
            <View style={styles.otpField}>
              <TextInputRegister
                keyboardType="number-pad"
                maxLength={OTP_MAX_LENGTH}
                onChangeText={handleChange('otp')}
                placeholder={t('register_flow.otp_placeholder')}
                ref={otpReference}
                secureTextEntry
                testID="register-flow-otp"
                textAlign="right"
                value={values.otp}
              />
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                onPressRequestOtp(() => {
                  updateOtpSent(true);
                });
              }}
              style={styles.requestButton}
              testID="register-flow-request"
            >
              <Text style={styles.requestText}>
                {t('register_flow.request_verification')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {showCarriers ? (
          <View style={styles.carrierList}>
            {CARRIERS.map(option => (
              <TouchableOpacity
                activeOpacity={0.8}
                key={option}
                onPress={() => {
                  handleChange('carrier')(option);
                  setShowCarriers(false);
                }}
                style={styles.carrierOption}
                testID={`register-flow-carrier-${option}`}
              >
                <Text style={styles.carrierOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : undefined}

        <Text style={styles.warning}>{t('register_flow.warning')}</Text>
      </View>
      <View style={styles.footer}>
        <View
          style={{
            width: '100%',
            height: ScaleSize(10),
            backgroundColor: '#F0F0F0',
            marginBottom: ScaleSize(30),
            // position: 'absolute',
            // bottom: ScaleSize(20),
          }}
        />
        <Button
          disabled={disabled || !isFormValid}
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
    </Pressable>
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
  carrierList: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    borderRadius: ScaleSize(8),
    borderWidth: ScaleSize(1),
    marginTop: ScaleSize(8),
  },
  carrierOption: {
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(10),
  },
  carrierOptionText: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(15),
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
    height: ScaleSize(1),
    marginVertical: ScaleSize(8),
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
    marginTop: ScaleSize(24),
  },
  dobSeparator: {
    color: PLACEHOLDER_COLOR,
    fontSize: ScaleSize(16),
    paddingBottom: ScaleSize(12),
  },
  footer: {
    bottom: ifAndroid(ScaleSize(25), 0),
    left: 0,
    zIndex: 9,
    position: 'absolute',
    right: 0,
  },
  formBlock: {
    paddingHorizontal: ScaleSize(24),
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingBottom: ScaleSize(10),
    paddingTop: ScaleSize(16),
    position: 'relative',
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
    marginLeft: ScaleSize(16),
    justifyContent: 'flex-end',
  },
  phoneField: {
    flex: 1,
    marginLeft: ScaleSize(16),
  },
  phoneRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginTop: ScaleSize(24),
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
  warning: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(12),
    lineHeight: ScaleSize(18),
    marginTop: ScaleSize(24),
  },
});

export default React.memo(InputInfo);
