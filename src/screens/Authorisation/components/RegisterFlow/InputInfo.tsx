import { Button } from '@components';
import Image from '@components/Image';
import imageNames from '@assets/images/names';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ScaleSize } from '@kits/core';
import { DeviceUtils } from '@kits/core/utils';
const { ifAndroid } = DeviceUtils;
const BANNER_HEIGHT = ScaleSize(30);
const BANNER_WIDTH = ScaleSize(68);
const ICON_CHEVRON_SIZE = ScaleSize(18);
const ICON_RADIO_SIZE = ScaleSize(20);
const ICON_COLOR = '#666666';
const UNDERLINE_COLOR = '#9E9E9E';
const UNDERLINE_HEIGHT = ScaleSize(1.5);
const TEXT_COLOR = '#1A1A1A';
const PLACEHOLDER_COLOR = '#9E9E9E';
const FIELD_BORDER_RADIUS = 0;
const PHONE_MAX_LENGTH = 13;
const OTP_MAX_LENGTH = 6;

export type InputInfoValues = {
  birthday: string;
  carrier: string;
  indentify: string;
  name: string;
  otp: string;
  phone: string;
};

type InputInfoProps = {
  readonly disabled?: boolean;
  readonly onInfoChange: (field: keyof InputInfoValues, value: string) => void;
  readonly onPressRequestOtp: (onSuccess: () => void) => void;
  readonly onSubmit: () => void;
};

const CARRIERS = ['SKT', 'KT', 'LGU+'];
const IDENTIFY_MAX_LENGTH = 6;
const BIRTHDAY_MAX_LENGTH = 6;

const INITIAL_INFO: InputInfoValues = {
  birthday: '',
  carrier: 'SKT',
  indentify: '',
  name: '',
  otp: '',
  phone: '',
};

function InputInfo({
  disabled = false,
  onInfoChange,
  onPressRequestOtp,
  onSubmit,
}: InputInfoProps) {
  const { t } = useTranslation();
  const [agreed, setAgreed] = useState(false);
  const [showCarriers, setShowCarriers] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [values, setValues] = useState<InputInfoValues>(INITIAL_INFO);
  const otpReference = useRef<TextInput>(null);

  useEffect(() => {
    if (otpSent) {
      otpReference.current?.focus();
    }
  }, [otpSent]);

  const handleChange = (field: keyof InputInfoValues) => (value: string) => {
    setValues(previous => ({ ...previous, [field]: value }));
    onInfoChange(field, value);
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
            setAgreed(previous => !previous);
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
        <View style={[styles.dobRow, styles.underlinedField]}>
          <View style={[styles.dobDateField]}>
            <TextInput
              keyboardType="number-pad"
              onChangeText={handleChange('birthday')}
              maxLength={BIRTHDAY_MAX_LENGTH}
              placeholder={t('register_flow.dob_label')}
              placeholderTextColor={PLACEHOLDER_COLOR}
              style={styles.underlinedInput}
              testID="register-flow-birthday1"
              value={values.birthday}
            />
          </View>

          <Text style={styles.dobSeparator}>—</Text>

          <View style={[styles.dobDateField]}>
            <TextInput
              keyboardType="number-pad"
              onChangeText={handleChange('indentify')}
              placeholder={t('register_flow.identify_label')}
              secureTextEntry
              maxLength={IDENTIFY_MAX_LENGTH}
              placeholderTextColor={PLACEHOLDER_COLOR}
              style={[styles.underlinedInput, { textAlign: 'right' }]}
              testID="register-flow-birthday2"
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
            <TextInput
              keyboardType="number-pad"
              maxLength={PHONE_MAX_LENGTH}
              onChangeText={handleChange('phone')}
              placeholder={t('register_flow.phone_placeholder')}
              placeholderTextColor={PLACEHOLDER_COLOR}
              style={styles.underlinedInput}
              testID="register-flow-phone"
              value={values.phone}
            />
          </View>

          {otpSent ? (
            <View style={styles.otpField}>
              <TextInput
                keyboardType="number-pad"
                onChangeText={handleChange('otp')}
                placeholder={t('register_flow.otp_placeholder')}
                placeholderTextColor={PLACEHOLDER_COLOR}
                secureTextEntry
                ref={otpReference}
                maxLength={OTP_MAX_LENGTH}
                style={[styles.underlinedInput, { textAlign: 'right' }]}
                testID="register-flow-otp"
                value={values.otp}
              />
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                onPressRequestOtp(() => {
                  setOtpSent(true);
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
    borderBottomColor: UNDERLINE_COLOR,
    borderBottomWidth: UNDERLINE_HEIGHT,
    borderWidth: 1,
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
  underlinedField: {
    borderBottomColor: UNDERLINE_COLOR,
    borderBottomWidth: UNDERLINE_HEIGHT,
    borderRadius: FIELD_BORDER_RADIUS,
  },
  underlinedInput: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(16),
    paddingHorizontal: 0,
    paddingVertical: ScaleSize(12),
  },
  warning: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(12),
    lineHeight: ScaleSize(18),
    marginTop: ScaleSize(24),
  },
});

export default React.memo(InputInfo);
