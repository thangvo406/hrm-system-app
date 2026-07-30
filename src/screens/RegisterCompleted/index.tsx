import { Button, Image } from '@components';
import RegisterHeader from '@screens/Authorisation/components/RegisterFlow/Header';
import imageNames from '@assets/images/names';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { ScaleSize } from '@kits/core';
import { Paths } from '@navigation/paths';
import AppNavigator from '@navigation/AppNavigator';
import { AppStorage } from '@services/common/storage';
import { AppConstants } from '@constants';
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TEXT_COLOR = '#1A1A1A';
const MASCOT_SIZE = ScaleSize(300);
const SEPARATOR_HEIGHT = ScaleSize(10);

const onContribution = () => {
  AppStorage.set(AppConstants.NEED_CONTRIBUTION_KEY, true);
  AppNavigator.reset(Paths.Authorization);
};

const DESC = {
  forgot_pass: 'forgot_password.desc_success',
  update_pass: 'update_pass.desc_success',
  default: 'register_completed.desc',
};
function RegisterCompleted() {
  const { t } = useTranslation();
  const { params } = useRoute();
  const insets = useSafeAreaInsets();
  const { goFrom, isHideContribution, onSubmit } = params as {
    goFrom: string;
    isHideContribution: boolean;
    onSubmit: () => void;
  };
  const desc = DESC[goFrom] || DESC.default;

  const _onSubmit = () => {
    if (onSubmit) {
      AppNavigator.goBack();
      onSubmit();
    } else {
      AppNavigator.reset(Paths.Authorization);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <RegisterHeader />

      <View style={styles.content}>
        <Image
          height={MASCOT_SIZE}
          name={imageNames.img_register_success}
          resizeMode="stretch"
          width={MASCOT_SIZE}
        />
        <Text style={styles.desc}>{t(desc)}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerSeparator} />
        <Button
          onPress={_onSubmit}
          style={styles.nextButton}
          testID="register-completed-next"
          title={t('register_completed.complete')}
          type="primary"
        />
        {!isHideContribution && (
          <Button
            onPress={onContribution}
            style={styles.nextButton}
            testID="register-completed-contribution"
            title={t('register_completed.contribution')}
            type="outline-bordered-rounded"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: ScaleSize(24),
  },
  desc: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(24),
    lineHeight: ScaleSize(26),
    marginTop: ScaleSize(40),
    textAlign: 'center',
  },
  footer: {
    paddingBottom: ScaleSize(24),
  },
  footerSeparator: {
    backgroundColor: '#F0F0F0',
    height: SEPARATOR_HEIGHT,
    marginBottom: ScaleSize(24),
    width: '100%',
  },
  nextButton: {
    alignSelf: 'center',
    marginBottom: ScaleSize(12),
    width: '90%',
  },
});

export default RegisterCompleted;
