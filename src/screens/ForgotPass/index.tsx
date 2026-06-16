import type { ComponentType } from 'react';
import { useForgotPass } from '@hooks';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { useMemo } from 'react';
import RegisterCompleted from '../Authorisation/components/RegisterFlow/RegisterCompleted';
import RegisterForm from '../Authorisation/components/RegisterFlow/InputInfo';
import NewPasswordForm from './components/NewPasswordForm';
import { ForgotStep } from '@hooks/useForgotPass';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function ForgotPass() {
  const {
    agreed,
    carrier,
    onInfoChange,
    onPressCarrier,
    onPressRequestOtp,
    onSubmit,
    onToggleAgreement,
    step,
  } = useForgotPass();

  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const detailProps = {
    agreed,
    carrier,
    onInfoChange,
    onPressCarrier,
    onPressRequestOtp,
    onSubmit,
    onToggleAgreement,
    desc: t('forgot_password.desc_success'),
  };

  const DetailComponent = useMemo(() => {
    const screens: Record<ForgotStep, ComponentType<any>> = {
      new_pass_form: NewPasswordForm,
      register_completed: RegisterCompleted,
      register_input: RegisterForm,
    };
    return screens[step];
  }, [step]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <DetailComponent {...detailProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
});

export default ForgotPass;
