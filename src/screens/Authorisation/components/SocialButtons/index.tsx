import type { IconName } from '@assets/icons';

import Image from '@components/Image';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SOCIAL_ICON_SIZE = 22;

export type SocialProvider = 'google' | 'kakao' | 'naver';

type SocialOption = {
  readonly icon: IconName;
  readonly labelKey: string;
  readonly provider: SocialProvider;
  readonly testID: string;
};

const SOCIAL_OPTIONS: readonly SocialOption[] = [
  {
    icon: 'kakao',
    labelKey: 'authorisation.continue_kakao',
    provider: 'kakao',
    testID: 'auth-kakao-button',
  },
  {
    icon: 'naver',
    labelKey: 'authorisation.continue_naver',
    provider: 'naver',
    testID: 'auth-naver-button',
  },
  {
    icon: 'google',
    labelKey: 'authorisation.continue_google',
    provider: 'google',
    testID: 'auth-google-button',
  },
];

type SocialButtonsProps = {
  readonly onPress?: (provider: SocialProvider) => void;
};

function SocialButtons({ onPress = undefined }: SocialButtonsProps) {
  const { t } = useTranslation();

  return (
    <>
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>{t('authorisation.or')}</Text>
        <View style={styles.dividerLine} />
      </View>

      {SOCIAL_OPTIONS.map(({ icon, labelKey, provider, testID }) => (
        <TouchableOpacity
          activeOpacity={0.8}
          key={provider}
          onPress={() => {
            onPress?.(provider);
          }}
          style={styles.socialButton}
          testID={testID}
        >
          <Image
            height={SOCIAL_ICON_SIZE}
            name={icon}
            type="svg"
            width={SOCIAL_ICON_SIZE}
          />
          <Text style={styles.socialText}>{t(labelKey)}</Text>
        </TouchableOpacity>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  divider: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginVertical: 16,
  },
  dividerLine: {
    backgroundColor: '#D0D0D0',
    flex: 1,
    height: 1,
  },
  dividerText: {
    color: '#6B6B6B',
    fontSize: 14,
  },
  socialButton: {
    alignItems: 'center',
    borderColor: '#E0E0E0',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    height: 50,
    justifyContent: 'center',
    marginBottom: 12,
  },
  socialText: {
    color: '#303030',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default SocialButtons;
