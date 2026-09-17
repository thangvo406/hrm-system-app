import LoginFooter from './LoginFooter';
import LoginForm from './LoginForm';
import LoginHero from './LoginHero';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useAuthorisation } from '@hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// How far the white sheet slides up over the artwork.
const SHEET_OVERLAP = ScaleSize(28);

function Authorisation() {
  const insets = useSafeAreaInsets();
  const {
    email,
    errors,
    onChangeEmail,
    onChangePassword,
    onFocusPassword,
    onSignIn,
    onToggleRememberMe,
    password,
    passwordRef,
    rememberMe,
  } = useAuthorisation();

  return (
    <View style={styles.container} testID="AuthorisationScreen">
      <ScrollView
        automaticallyAdjustKeyboardInsets
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <LoginHero />
        <View style={styles.sheet}>
          <LoginForm
            email={email}
            emailError={errors.email}
            onChangeEmail={onChangeEmail}
            onChangePassword={onChangePassword}
            onFocusPassword={onFocusPassword}
            onSignIn={onSignIn}
            onToggleRememberMe={onToggleRememberMe}
            password={password}
            passwordError={errors.password}
            passwordRef={passwordRef}
            rememberMe={rememberMe}
          />
          <View
            style={[
              styles.footer,
              { paddingBottom: insets.bottom + ScaleSize(16) },
            ]}
          >
            <LoginFooter />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: ScaleSize(24),
  },
  scrollContent: {
    flexGrow: 1,
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: ScaleSize(32),
    borderTopRightRadius: ScaleSize(32),
    flex: 1,
    marginTop: -SHEET_OVERLAP,
    paddingTop: ScaleSize(28),
  },
});

export default Authorisation;
