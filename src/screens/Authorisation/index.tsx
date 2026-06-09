import type { RootScreenProps } from '@navigation/types';
import type { AuthStep } from '@hooks';
import type { ComponentType } from 'react';

import { AuthFormStack, AuthInfoForm, Snackbar } from '@components';
import ChooseMemberShipType from '@screens/Authorisation/components/RegisterFlow/ChooseMemberShipType';
import ChooseSchool from '@screens/Authorisation/components/RegisterFlow/ChooseSchool';
import { Paths } from '@navigation/paths';
import { useAuthorization } from '@hooks';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo } from 'react';

type AuthTab = 'login' | 'registration';

function Authorization({ route }: RootScreenProps<Paths.Authorization>) {
  const isLogin = route.params?.isLogin ?? true;
  const initialTab: AuthTab = isLogin ? 'login' : 'registration';

  const {
    cleanError,
    error,
    filteredSchools,
    handleSubmit,
    isLoginValid,
    isRegisterValid,
    loading,
    login,
    loginErrors,
    loginWithSocial,
    onLoginChange,
    onRegisterChange,
    onSchoolKeywordChange,
    onSelectMembership,
    onSelectSchool,
    registerChooseOptions,
    registerErrors,
    schoolKeyword,
    selectedMembershipId,
    selectedSchool,
    selectedSchoolId,
    step,
    submitLogin,
    submitRegister,
  } = useAuthorization();

  const detailProps = {
    filteredSchools,
    initialTab,
    loading,
    login,
    loginErrors,
    loginWithSocial,
    onLoginChange,
    onRegisterChange,
    onSchoolKeywordChange,
    onSelectMembership,
    onSelectSchool,
    onSubmit: handleSubmit,
    options: registerChooseOptions,
    registerErrors,
    schoolKeyword,
    selectedMembershipId,
    selectedSchool,
    selectedSchoolId,
    submitLogin,
    submitRegister,
    validLogin: isLoginValid,
    validRegister: isRegisterValid,
  };

  const DetailComponent = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const screens: Record<AuthStep, ComponentType<any>> = {
      choose_membership: ChooseMemberShipType,
      choose_role: ChooseMemberShipType,
      choose_school: ChooseSchool,
      form: AuthFormStack,
      info: AuthInfoForm,
    };
    return screens[step];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <SafeAreaView mode="padding" style={styles.container}>
      <Snackbar message={error} visible={!!error} onDismiss={cleanError} />
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
