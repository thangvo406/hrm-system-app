import KeyboardAvoidingView from '@components/KeyboardAvoidingView';
import LoginFooter from './LoginFooter';
import LoginForm from './LoginForm';
import LoginHero from './LoginHero';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useAuthorisation } from '@hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// How far the white sheet slides up over the artwork.
const SHEET_OVERLAP = ScaleSize(32);
const SHEET_SHADOW_OPACITY = 0.08;
const SHEET_SHADOW_OFFSET = ScaleSize(6);
const SHEET_ELEVATION = ScaleSize(10);

function Authorisation() {
  const insets = useSafeAreaInsets();
  const {
    email,
    errors,
    isSubmitDisabled,
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
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView>
          {({ onFocusField }) => (
            <>
              <LoginHero />
              <View style={styles.sheet}>
                <LoginForm
                  email={email}
                  emailError={errors.email}
                  isSubmitDisabled={isSubmitDisabled}
                  onChangeEmail={onChangeEmail}
                  onChangePassword={onChangePassword}
                  onFocusField={onFocusField}
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
            </>
          )}
        </KeyboardAvoidingView>
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
    borderTopLeftRadius: ScaleSize(28),
    borderTopRightRadius: ScaleSize(28),
    elevation: SHEET_ELEVATION,
    flex: 1,
    marginHorizontal: ScaleSize(14),
    marginTop: -SHEET_OVERLAP,
    paddingTop: ScaleSize(24),
    shadowColor: Colors.navy01,
    shadowOffset: { height: -SHEET_SHADOW_OFFSET, width: 0 },
    shadowOpacity: SHEET_SHADOW_OPACITY,
    shadowRadius: ScaleSize(16),
  },
});

export default Authorisation;
