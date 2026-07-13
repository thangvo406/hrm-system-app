import type { RootScreenProps } from '@navigation/types';
import type { AuthStep } from '@hooks';
import type { ComponentType } from 'react';
import ChooseMemberShipType from './components/RegisterFlow/ChooseMemberShipType';
import { Paths } from '@navigation/paths';
import { useAuthorization } from '@hooks';
import { StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import RegisterForm from './components/RegisterFlow/InputInfo';
import AuthFormStack from './components/AuthFormStack';
import BankInformation from './components/RegisterFlow/BankInformation';
import InputAcademicEmail from './components/RegisterFlow/InputAcademicEmail';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AcademicVerification from './components/RegisterFlow/AcademicVerification';
import AcademicVerifyCompleted from './components/RegisterFlow/AcademicVerifyCompleted';
import RegisterCompleted from './components/RegisterFlow/RegisterCompleted';
import SchoolSelection from '@screens/SchoolSelection';

type AuthTab = 'login' | 'registration';

function Authorization({ route }: RootScreenProps<Paths.Authorization>) {
  const isLogin = route.params?.isLogin ?? true;
  const initialTab: AuthTab = isLogin ? 'login' : 'registration';
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const {
    clearLoginErrors,
    isLoginValid,
    loading,
    loginErrors,
    loginWithSocial,
    onLoginChange,
    register,
    submitLogin,
    onForgotPassword,
  } = useAuthorization();

  const detailProps = {
    agreed: register.agreed,
    carrier: register.carrier,
    desc: t('register_completed.desc'),
    initialTab,
    loading,
    loginErrors,
    loginWithSocial,
    onClearErrors: () => {
      clearLoginErrors();
      register.clearErrors();
    },
    onForgotPassword,
    onGoRegisterForm: register.onGoRegisterForm,
    onInfoChange: register.onInfoChange,
    titleBtnPrimary: register.titleRegisterCompletedBtnPrimary,
    titleBtnSecondary: register.titleRegisterCompletedBtnSecondary,
    onLoginChange,
    onPressCarrier: register.onPressCarrier,
    onPressRequestOtp: register.onPressRequestOtp,
    onRegisterChange: register.onRegisterChange,
    onSelectMembership: register.onSelectMembership,
    onSubmit: register.handleSubmit,
    onToggleAgreement: register.onToggleAgreement,
    onPressVerify: register.onPressVerify,
    onReEnterEmailAcademic: register.onReEnterEmailAcademic,
    onResendEmailAcademic: register.onResendEmailAcademic,
    onPressSecondary: register.onPressSelectSchool,
    onOtpEmailAcademicChanged: register.onOtpEmailAcademicChanged,
    onBack: register.goBack,
    showBtnBack: register.needShowBtnBack,
    registerValues: register.formData.current,
    mailAcademic: register.mailAcademic,
    options: register.chooseOptions,
    registerErrors: register.registerErrors,
    selectedMembershipId: register.selectedMembershipId,
    submitLogin,
    validLogin: isLoginValid,
    validRegister: register.isRegisterValid,
  };

  const DetailComponent = useMemo(() => {
    const screens: Record<AuthStep, ComponentType<any>> = {
      choose_membership: ChooseMemberShipType,
      choose_role: ChooseMemberShipType,
      form: AuthFormStack,
      academic_verification_completed: AcademicVerifyCompleted,
      input_academic_email: InputAcademicEmail,
      academic_verification: AcademicVerification,
      register_input: RegisterForm,
      bank_information: BankInformation,
      verified_info: RegisterCompleted,
      choose_school: SchoolSelection,
    };
    return screens[register.step];
  }, [register.step]);

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

export default Authorization;
