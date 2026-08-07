import type { ComponentType } from 'react';
import { useForgotPass } from '@hooks';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { useMemo } from 'react';
import RegisterCompleted from '../Authorisation/components/RegisterFlow/RegisterCompleted';
import NewPasswordForm from './components/NewPasswordForm';
import { ForgotStep } from '@hooks/useForgotPass';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import InputEmail from './components/InputEmail';

function ForgotPass(props: any) {
  const { onSubmit, step, onBack } = useForgotPass(props);

  const insets = useSafeAreaInsets();

  const detailProps = {
    onSubmit,
    onBack,
    titleRegisterInfoKey: 'forgot_password.title_register_info',
  };

  const DetailComponent = useMemo(() => {
    const screens: Record<ForgotStep, ComponentType<any>> = {
      new_pass_form: NewPasswordForm,
      register_completed: RegisterCompleted,
      register_input: InputEmail,
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
