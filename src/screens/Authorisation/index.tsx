import type { RootScreenProps } from '@navigation/types';
import type { AuthStep } from '@hooks';
import type { ComponentType } from 'react';

import { AuthFormStack, AuthInfoForm, Snackbar } from '@components';
import ChooseMemberShipType from './components/RegisterFlow/ChooseMemberShipType';
import ChooseSchool from './components/RegisterFlow/ChooseSchool';
import { Paths } from '@navigation/paths';
import { useAuthorization } from '@hooks';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo } from 'react';
import RegisterCompleted from './components/RegisterFlow/RegisterCompleted';

type AuthTab = 'login' | 'registration';

function Authorization({ route }: RootScreenProps<Paths.Authorization>) {
  const isLogin = route.params?.isLogin ?? true;
  const initialTab: AuthTab = isLogin ? 'login' : 'registration';

  const {
    cleanError,
    error,
    isLoginValid,
    loading,
    login,
    loginErrors,
    loginWithSocial,
    onLoginChange,
    register,
    submitLogin,
  } = useAuthorization();

  const detailProps = {
    filteredSchools: register.filteredSchools,
    initialTab,
    loading,
    login,
    loginErrors,
    loginWithSocial,
    onLoginChange,
    onRegisterChange: register.onRegisterChange,
    onSchoolKeywordChange: register.onSchoolKeywordChange,
    onSelectMembership: register.onSelectMembership,
    onSelectSchool: register.onSelectSchool,
    onSubmit: register.handleSubmit,
    options: register.chooseOptions,
    registerErrors: register.registerErrors,
    schoolKeyword: register.schoolKeyword,
    selectedMembershipId: register.selectedMembershipId,
    selectedSchool: register.selectedSchool,
    selectedSchoolId: register.selectedSchoolId,
    submitLogin,
    onPressRequestOtp: register.onPressRequestOtp,
    submitRegister: register.submitRegister,
    onInfoChange: register.onInfoChange,
    validLogin: isLoginValid,
    validRegister: register.isRegisterValid,
  };

  const DetailComponent = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const screens: Record<AuthStep, ComponentType<any>> = {
      choose_membership: ChooseMemberShipType,
      choose_role: ChooseMemberShipType,
      choose_school: ChooseSchool,
      form: AuthFormStack,
      info: AuthInfoForm,
      register_completed: RegisterCompleted,
    };
    return screens[register.step];
  }, [register.step]);

  return (
    <SafeAreaView mode="padding" style={styles.container}>
      <Snackbar message={error} visible={!!error} onDismiss={cleanError} />
      <Snackbar
        message={register.apiError}
        onDismiss={() => {
          register.clearApiError();
        }}
        visible={!!register.apiError}
      />
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
