import { Button, HeaderDetail } from '@components';
import { useRegisterCard } from '@hooks/useRegisterCard';
import { ScaleSize } from '@kits/core';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MethodOption from './MethodOption';

function RegisterCard() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { methods, onSelectMethod, onSubmit, selectedMethod } =
    useRegisterCard();

  return (
    <View style={styles.container}>
      <HeaderDetail hideNotify title="" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t('register_card.title')}</Text>

        <View style={styles.options}>
          {methods.map(method => (
            <MethodOption
              key={method.key}
              method={method}
              onSelect={onSelectMethod}
              selected={method.key === selectedMethod}
            />
          ))}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + ScaleSize(16) },
        ]}
      >
        <Button
          onPress={onSubmit}
          testID="register-card-submit"
          title={t('register_card.submit')}
          type="rounded"
        />
      </View>
    </View>
  );
}

export default RegisterCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(12),
  },
  options: {
    gap: ScaleSize(12),
    marginTop: ScaleSize(28),
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(8),
  },
  title: {
    color: '#1A1A1A',
    fontSize: ScaleSize(24),
    fontWeight: '800',
    lineHeight: ScaleSize(34),
    marginTop: ScaleSize(8),
  },
});
