import type { RootScreenProps } from '@navigation/types';
import type { AuthStep } from '@type/auth';
import type { ComponentType } from 'react';
import ChooseMemberShipType from './components/RegisterFlow/ChooseMemberShipType';
import { Paths } from '@navigation/paths';
import { useAuthorization } from '@hooks';
import { StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import RegisterForm from './components/RegisterFlow/InputInfo';
import AuthFormStack from './components/AuthFormStack';
import BankInformationView from '@screens/BankInformation/BankInformationView';
import InputAcademicEmail from './components/RegisterFlow/InputAcademicEmail';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AcademicVerification from './components/RegisterFlow/AcademicVerification';
import AcademicVerifyCompleted from './components/RegisterFlow/AcademicVerifyCompleted';
import RegisterCompleted from './components/RegisterFlow/RegisterCompleted';
import SchoolSelection from '@screens/SchoolSelection';
import { VerificationFailed } from '@components';

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
    resetLoginForm,
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
    // onSelectMembership,
    onToggleAgreement,
    onOTPEmailAcademicExpired,
    registerErrors,
    resetRegisterForm,
    emailExpiresIn,
    timeResendOtpVerifyEmail,
    selectedMembershipId,
    step,
    titleRegisterCompletedBtnPrimary,
    titleRegisterCompletedBtnSecondary,
  } = register;

  // Reset the form of the tab being left so it is empty when coming back.
  const onTabBlur = (tab: AuthTab) => {
    if (tab === 'registration') {
      resetRegisterForm();
    } else {
      resetLoginForm();
    }
  };

  const DetailComponent = useMemo(() => {
    const screens: Record<AuthStep, ComponentType<any>> = {
      choose_membership: ChooseMemberShipType,
      choose_role: ChooseMemberShipType,
      form: AuthFormStack,
      academic_verification_completed: AcademicVerifyCompleted,
      verify_info_failed: VerificationFailed,
      input_academic_email: InputAcademicEmail,
      academic_verification: AcademicVerification,
      register_input: RegisterForm,
      bank_information: BankInformationView,
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
        emailExpiresIn={emailExpiresIn}
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
        timeResendOtpVerifyEmail={timeResendOtpVerifyEmail}
        // onSelectMembership={onSelectMembership}
        onSubmit={handleSubmit}
        onTabBlur={onTabBlur}
        onToggleAgreement={onToggleAgreement}
        options={chooseOptions}
        registerErrors={registerErrors}
        registerValues={formData.current}
        selectedMembershipId={selectedMembershipId}
        showBtnBack={needShowBtnBack}
        submitLogin={submitLogin}
        titleBtnPrimary={titleRegisterCompletedBtnPrimary}
        titleBtnSecondary={titleRegisterCompletedBtnSecondary}
        topHeader={0}
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
