import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RegisterHeader from './Header';
import { useTranslation } from 'react-i18next';
import { ScaleSize } from '@kits/core';
import TextField from '@components/TextField';
import { debounce } from 'lodash';
import { ValidateUtils } from '@kits/core/utils';
import Button from '@components/Button';
import { Colors } from '@constants';

const TEXT_COLOR = '#1A1A1A';

function Index(props: any) {
  const { t } = useTranslation();
  const { errors, onSubmit, mailAcademic } = props || {};
  const [emailValue, setEmailValue] = useState('');
  const [error, setError] = useState(errors?.emailAcademic);

  const isValid = ValidateUtils.isEmail(emailValue);

  useEffect(() => {
    setError(errors?.emailAcademic);
  }, [errors?.emailAcademic]);

  useEffect(() => {
    setEmailValue(mailAcademic);
  }, [mailAcademic]);

  useEffect(() => {
    if (emailValue && !ValidateUtils.isEmail(emailValue)) {
      setError(t('authorisation.error_email_invalid'));
    } else {
      setError('');
    }
  }, [emailValue]);

  const _onSubmit = () => {
    if (isValid) {
      onSubmit(emailValue);
    }
  };

  return (
    <View style={styles.container}>
      <RegisterHeader />

      <View style={styles.content}>
        <Text style={styles.title}>{t('input_academic_email.title')}</Text>
        <Text style={[styles.desc, { marginLeft: 0 }]}>
          {t('input_academic_email.desc')}
        </Text>

        <TextField
          autoCapitalize="none"
          //   error={errors.email}
          iconName="email"
          keyboardType="email-address"
          label={t('authorisation.email_label')}
          defaultValue={mailAcademic}
          onChangeText={debounce(setEmailValue, 350)}
          //   onChangeText={onChange('academicEmail')}
          onSubmitEditing={_onSubmit}
          placeholder={t('authorisation.email_placeholder')}
          returnKeyType="done"
          submitBehavior="submit"
          testID="register-email-input"
        />

        {!!error && <Text style={styles.errorApi}>{error}</Text>}

        <Button
          disabled={!isValid}
          title={t('input_academic_email.btn_submit')}
          // loading={loading}
          style={styles.btnSubmit}
          onPress={_onSubmit}
          type="primary"
          testID="auth-login-button"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorApi: {
    color: 'red',
    fontSize: ScaleSize(14),
    marginTop: ScaleSize(8),
  },
  btnSubmit: {
    marginTop: ScaleSize(60),
  },
  content: {
    flex: 1,
    paddingHorizontal: ScaleSize(24),
    paddingTop: ScaleSize(32),
  },
  title: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(26),
    fontWeight: '700',
    marginBottom: ScaleSize(40),
  },
  desc: {
    color: Colors.gray5,
    fontSize: ScaleSize(15),
    marginLeft: ScaleSize(14),
    marginBottom: ScaleSize(30),
  },
});
export default Index;
