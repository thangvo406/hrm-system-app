import type { RootScreenProps } from '@navigation/types';
import type { AuthStep } from '@hooks';
import type { ChooseSchoolValues } from '@screens/Authorisation/components/RegisterFlow/ChooseSchool';
import type { InputInfoValues } from '@screens/Authorisation/components/RegisterFlow/InputInfo';
import type { ComponentType } from 'react';

import { AuthFormStack, AuthInfoForm, Snackbar } from '@components';
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
    isLoginValid,
    isRegisterValid,
    loading,
    login,
    loginErrors,
    loginWithSocial,
    onLoginChange,
    onRegisterChange,
    onSchoolKeywordChange,
    onSelectSchool,
    register,
    registerErrors,
    schoolKeyword,
    selectedSchool,
    selectedSchoolId,
    step,
    submitInfo,
    submitLogin,
    submitRegister,
  } = useAuthorization();

  const handleDetailSubmit = (
    values: ChooseSchoolValues | InputInfoValues,
  ) => {
    if ('school' in values) {
      // TODO: dispatch register with collected info + selected school
      return;
    }
    submitInfo(values);
  };

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
    onSelectSchool,
    onSubmit: handleDetailSubmit,
    register,
    registerErrors,
    schoolKeyword,
    selectedSchool,
    selectedSchoolId,
    submitLogin,
    submitRegister,
    validLogin: isLoginValid,
    validRegister: isRegisterValid,
  };

  const DetailComponent = useMemo(() => {
    const screens: Record<AuthStep, ComponentType<typeof detailProps>> = {
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
