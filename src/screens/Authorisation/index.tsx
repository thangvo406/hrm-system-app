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

  const {
    agreed,
    carrier,
    chooseOptions,
    clearErrors,
    formData,
    goBack,
    handleSubmit,
    isRegisterValid,
    isVerifiedEmailAcademic,
    mailAcademic,
    needShowBtnBack,
    onGoRegisterForm,
    onInfoChange,
    onPressCarrier,
    onPressRequestOtp,
    onPressSelectSchool,
    onPressVerify,
    onPressVerifyEmailAcademic,
    onReEnterEmailAcademic,
    onRegisterChange,
    onResendEmailAcademic,
    dataInfoVerifyMembership,
    onSelectMembership,
    onToggleAgreement,
    onOTPEmailAcademicExpired,
    registerErrors,
    selectedMembershipId,
    step,
    titleRegisterCompletedBtnPrimary,
    titleRegisterCompletedBtnSecondary,
  } = register;

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
    return screens[step];
  }, [step]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <DetailComponent
        agreed={agreed}
        carrier={carrier}
        desc={t('register_completed.desc')}
        initialTab={initialTab}
        isVerifiedEmailAcademic={isVerifiedEmailAcademic}
        loading={loading}
        loginErrors={loginErrors}
        loginWithSocial={loginWithSocial}
        mailAcademic={mailAcademic}
        onBack={goBack}
        onClearErrors={() => {
          clearLoginErrors();
          clearErrors();
        }}
        onOTPEmailAcademicExpired={onOTPEmailAcademicExpired}
        dataVerifiedMembership={dataInfoVerifyMembership}
        onForgotPassword={onForgotPassword}
        onGoRegisterForm={onGoRegisterForm}
        onInfoChange={onInfoChange}
        onLoginChange={onLoginChange}
        onPressCarrier={onPressCarrier}
        onPressRequestOtp={onPressRequestOtp}
        onPressSecondary={onPressSelectSchool}
        onPressVerify={onPressVerify}
        onPressVerifyEmailAcademic={onPressVerifyEmailAcademic}
        onReEnterEmailAcademic={onReEnterEmailAcademic}
        onRegisterChange={onRegisterChange}
        onResendEmailAcademic={onResendEmailAcademic}
        onSelectMembership={onSelectMembership}
        onSubmit={handleSubmit}
        onToggleAgreement={onToggleAgreement}
        options={chooseOptions}
        registerErrors={registerErrors}
        registerValues={formData.current}
        selectedMembershipId={selectedMembershipId}
        showBtnBack={needShowBtnBack}
        submitLogin={submitLogin}
        titleBtnPrimary={titleRegisterCompletedBtnPrimary}
        titleBtnSecondary={titleRegisterCompletedBtnSecondary}
        topHeader={1}
        validLogin={isLoginValid}
        validRegister={isRegisterValid}
      />
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
