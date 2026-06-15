import type { RootScreenProps } from '@navigation/types';
import type { AuthStep } from '@hooks';
import type { ComponentType } from 'react';

import ChooseMemberShipType from './components/RegisterFlow/ChooseMemberShipType';
import ChooseSchool from './components/RegisterFlow/ChooseSchool';
import { Paths } from '@navigation/paths';
import { useAuthorization } from '@hooks';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import RegisterCompleted from './components/RegisterFlow/RegisterCompleted';
import RegisterForm from './components/RegisterFlow/InputInfo';
import AuthFormStack from './components/AuthFormStack';
import BankInformation from './components/RegisterFlow/BankInformation';
type AuthTab = 'login' | 'registration';

function Authorization({ route }: RootScreenProps<Paths.Authorization>) {
  const isLogin = route.params?.isLogin ?? true;
  const initialTab: AuthTab = isLogin ? 'login' : 'registration';
  const { t } = useTranslation();

  const {
    isLoginValid,
    loading,
    login,
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
    filteredSchools: register.filteredSchools,
    initialTab,
    loading,
    login,
    loginErrors,
    loginWithSocial,
    onLoginChange,
    onPressCarrier: register.onPressCarrier,
    onRegisterChange: register.onRegisterChange,
    onSchoolKeywordChange: register.onSchoolKeywordChange,
    onSelectMembership: register.onSelectMembership,
    onSelectSchool: register.onSelectSchool,
    onSubmit: register.handleSubmit,
    onToggleAgreement: register.onToggleAgreement,
    options: register.chooseOptions,
    registerErrors: register.registerErrors,
    schoolKeyword: register.schoolKeyword,
    selectedMembershipId: register.selectedMembershipId,
    selectedSchool: register.selectedSchool,
    selectedSchoolId: register.selectedSchoolId,
    submitLogin,
    onForgotPassword,
    onPressRequestOtp: register.onPressRequestOtp,
    onGoRegisterForm: register.onGoRegisterForm,
    onInfoChange: register.onInfoChange,
    validLogin: isLoginValid,
    validRegister: register.isRegisterValid,
  };

  const DetailComponent = useMemo(() => {
    const screens: Record<AuthStep, ComponentType<any>> = {
      choose_membership: ChooseMemberShipType,
      choose_role: ChooseMemberShipType,
      choose_school: ChooseSchool,
      form: AuthFormStack,
      register_input: RegisterForm,
      register_completed: RegisterCompleted,
      bank_information: BankInformation,
    };
    return screens[register.step];
  }, [register.step]);

  return (
    <SafeAreaView mode="padding" style={styles.container}>
      <DetailComponent {...detailProps} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
});

export default Authorization;
