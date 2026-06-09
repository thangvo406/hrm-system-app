import { Button } from '@components';
import Image from '@components/Image';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { ScaleSize } from '@kits/core';

const BANNER_HEIGHT = 30;
const BANNER_WIDTH = 68;
const ICON_CHEVRON_SIZE = 18;
const ICON_RADIO_SIZE = 20;
const ICON_COLOR = '#666666';
const UNDERLINE_COLOR = '#9E9E9E';
const UNDERLINE_HEIGHT = 1.5;
const TEXT_COLOR = '#1A1A1A';
const PLACEHOLDER_COLOR = '#9E9E9E';
const FIELD_BORDER_RADIUS = 0;

type InputInfoValues = {
  birthday1: string;
  birthday2: string;
  carrier: string;
  name: string;
  phone: string;
};

type InputInfoProps = {
  readonly disabled?: boolean;
  readonly onSubmit: (values: InputInfoValues) => void;
};

const CARRIERS = ['SKT', 'KT', 'LGU+'];

const DOB_DATE_LENGTH = 6;
const DOB_GENDER_LENGTH = 1;
const PHONE_MIN_LENGTH = 10;
const PHONE_MAX_LENGTH = 11;

function InputInfo({ disabled = false, onSubmit }: InputInfoProps) {
  const { t } = useTranslation();
  const [agreed, setAgreed] = useState(false);
  const [name, setName] = useState('');
  const [birthday1, setBirthday1] = useState('');
  const [birthday2, setBirthday2] = useState('');
  const [carrier, setCarrier] = useState('SKT');
  const [showCarriers, setShowCarriers] = useState(false);
  const [phone, setPhone] = useState('');

  // const isFormValid =
  //   agreed &&
  //   name.trim().length > 0 &&
  //   birthday1.length === DOB_DATE_LENGTH &&
  //   birthday2.length === DOB_GENDER_LENGTH &&
  //   phone.length >= PHONE_MIN_LENGTH;

  const isFormValid =
    agreed &&
    name.trim().length &&
    birthday1.trim().length &&
    birthday2.trim().length &&
    phone.trim().length;

  const handleSubmit = () => {
    onSubmit({ birthday1, birthday2, carrier, name, phone });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          height={BANNER_HEIGHT}
          name="ic_logo_banner"
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
        <View style={styles.underlinedField}>
          <TextInput
            onChangeText={setName}
            placeholder={t('register_flow.name_label')}
            placeholderTextColor={PLACEHOLDER_COLOR}
            style={styles.underlinedInput}
            testID="register-flow-name"
            value={name}
          />
        </View>

        <View style={styles.dobRow}>
          <View style={[styles.underlinedField, styles.dobDateField]}>
            <TextInput
              keyboardType="number-pad"
              // maxLength={6}
              onChangeText={setBirthday1}
              placeholder={t('register_flow.dob_label')}
              placeholderTextColor={PLACEHOLDER_COLOR}
              style={styles.underlinedInput}
              testID="register-flow-birthday1"
              value={birthday1}
            />
          </View>

          <Text style={styles.dobSeparator}>—</Text>

          <View style={[styles.underlinedField, styles.dobGenderField]}>
            <TextInput
              keyboardType="number-pad"
              // maxLength={1}
              onChangeText={setBirthday2}
              placeholder=""
              secureTextEntry
              style={styles.underlinedInput}
              testID="register-flow-birthday2"
              value={birthday2}
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
            <TextInput
              keyboardType="number-pad"
              maxLength={PHONE_MAX_LENGTH}
              onChangeText={setPhone}
              placeholder={t('register_flow.phone_placeholder')}
              placeholderTextColor={PLACEHOLDER_COLOR}
              style={styles.underlinedInput}
              testID="register-flow-phone"
              value={phone}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.requestButton}
            testID="register-flow-request"
          >
            <Text style={styles.requestText}>
              {t('register_flow.request_verification')}
            </Text>
          </TouchableOpacity>
        </View>

        {showCarriers ? (
          <View style={styles.carrierList}>
            {CARRIERS.map(option => (
              <TouchableOpacity
                activeOpacity={0.8}
                key={option}
                onPress={() => {
                  setCarrier(option);
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
        <Button
          disabled={disabled || !isFormValid}
          title={t('register_flow.next')}
          onPress={handleSubmit}
          type="primary"
          testID="register-flow-next"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  agreeLabel: {
    color: TEXT_COLOR,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 10,
  },
  agreeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: ScaleSize(6),
  },
  carrierOption: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  carrierOptionText: {
    color: TEXT_COLOR,
    fontSize: 15,
  },
  carrierList: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  carrierPicker: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    minWidth: 70,
    paddingBottom: 12,
    paddingTop: 14,
  },
  carrierText: {
    color: TEXT_COLOR,
    fontSize: 15,
    fontWeight: '500',
  },
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  divider: {
    backgroundColor: '#F0F0F0',
    height: 1,
    marginVertical: 8,
  },
  dobDateField: {
    flex: 1,
  },
  dobGenderField: {
    width: 64,
  },
  dobRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  dobSeparator: {
    color: PLACEHOLDER_COLOR,
    fontSize: 16,
    paddingBottom: 12,
  },
  footer: {
    // paddingBottom: 24,
    paddingHorizontal: 24,
    // paddingTop: 12,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  formBlock: {
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingTop: 16,
    paddingBottom: ScaleSize(10),
    // paddingVertical: 24,
  },
  identityBlock: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  identityTitle: {
    color: TEXT_COLOR,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    marginBottom: 24,
  },
  linkRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: ScaleSize(6),
  },
  linkText: {
    color: TEXT_COLOR,
    fontSize: 14,
    flex: 1,
  },
  phoneField: {
    // borderBottomColor: UNDERLINE_COLOR,
    // borderBottomWidth: UNDERLINE_HEIGHT,
    flex: 1,
    marginLeft: 16,
  },
  phoneRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginTop: 24,
    borderBottomColor: UNDERLINE_COLOR,
    borderBottomWidth: UNDERLINE_HEIGHT,
  },
  requestButton: {
    marginLeft: 16,
    paddingBottom: 12,
    paddingTop: 12,
  },
  requestText: {
    color: PLACEHOLDER_COLOR,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'right',
    width: 60,
  },
  spacer: {
    flex: 1,
  },
  underlinedField: {
    borderBottomColor: UNDERLINE_COLOR,
    borderBottomWidth: UNDERLINE_HEIGHT,
    borderRadius: FIELD_BORDER_RADIUS,
  },
  underlinedInput: {
    color: TEXT_COLOR,
    fontSize: 16,
    paddingHorizontal: 0,
    paddingVertical: 12,
  },
  warning: {
    color: TEXT_COLOR,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 24,
  },
});

export default React.memo(InputInfo);
export type { InputInfoValues };
