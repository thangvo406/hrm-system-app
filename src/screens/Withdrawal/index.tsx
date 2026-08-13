import { Button, HeaderDetail, TextField } from '@components';
import { ScaleSize } from '@kits/core';
import {
  Animated,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '@constants';
import { DeviceUtils } from '@kits/core/utils';
// import { formatCurrency } from '@utils/product';
import { useWithdrawal } from '@hooks/useWithdrawal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import BalanceCard from './BalanceCard';
import BankSelector from './BankSelector';
import NoticeBox from './NoticeBox';
import { useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react-native';

const { ifAndroid, isIOS } = DeviceUtils;

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#9B9B9B';
const BORDER_COLOR = '#E0E0E0';
const KEYBOARD_ANIMATION_DURATION_MS = 250;

function Withdrawal() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    // amount,
    enabledBtnSubmit,
    onAccountNumberChange,
    // onAmountChange,
    onSubmit,
    selectedBank,
    // errorAmount,
    currentWallet,
    setAccountHolder,
    onPressBank,
  } = useWithdrawal();

  const keyboardOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent = isIOS() ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = isIOS() ? 'keyboardWillHide' : 'keyboardDidHide';

    // Shift the content up by exactly the keyboard height so the focused
    // reason input stays visible.
    const onShow = (event: KeyboardEvent) => {
      Animated.timing(keyboardOffset, {
        toValue: -event.endCoordinates.height / 2,
        duration: event.duration || KEYBOARD_ANIMATION_DURATION_MS,
        useNativeDriver: true,
      }).start();
    };

    const onHide = (event: KeyboardEvent) => {
      Animated.timing(keyboardOffset, {
        toValue: 0,
        duration: event.duration || KEYBOARD_ANIMATION_DURATION_MS,
        useNativeDriver: true,
      }).start();
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <View style={styles.safeArea}>
      <HeaderDetail hideNotify title={t('withdrawal.title')} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[{ flex: 1, transform: [{ translateY: keyboardOffset }] }]}
        >
          <BalanceCard walletBalance={currentWallet} />

          <Text style={styles.sectionLabel}>
            {t('withdrawal.amount_section')}
          </Text>

          <View style={styles.accountCard}>
            <Text style={styles.accountTitle}>
              {t('withdrawal.account_section')}
            </Text>
            <BankSelector
              onSelect={onPressBank}
              placeholder={t('withdrawal.bank_placeholder')}
              selectedBank={selectedBank}
            />
            <TextField
              onChangeText={onAccountNumberChange}
              placeholder={t('withdrawal.account_number_placeholder')}
              testID="withdrawal-account-number"
              showClear
              returnKeyType="done"
              keyboardType="number-pad"
            />
            <TextField
              onChangeText={setAccountHolder}
              placeholder={t('withdrawal.account_holder_placeholder')}
              testID="withdrawal-account-holder"
              returnKeyType="done"
              showClear
            />
          </View>
        </Animated.View>
        <NoticeBox />
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: ifAndroid(16, insets.bottom || 20) },
        ]}
      >
        <Button
          disabled={!enabledBtnSubmit}
          onPress={onSubmit}
          testID="withdrawal-submit"
          title={t('withdrawal.submit')}
        />
      </View>
    </View>
  );
}

export default Withdrawal;

const styles = StyleSheet.create({
  amountInput: {
    color: TEXT_DARK,
    fontSize: ScaleSize(20),
    fontWeight: '700',
    paddingVertical: ScaleSize(14),
    textAlign: 'right',
  },
  amountWrapper: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  accountCard: {
    borderColor: BORDER_COLOR,
    borderRadius: ScaleSize(16),
    borderWidth: 1,
    gap: ScaleSize(10),
    marginTop: ScaleSize(20),
    paddingHorizontal: ScaleSize(18),
    paddingVertical: ScaleSize(18),
  },
  accountTitle: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '700',
    marginBottom: ScaleSize(2),
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(12),
  },
  heading: {
    color: TEXT_DARK,
    fontSize: ScaleSize(24),
    fontWeight: '700',
    marginBottom: ScaleSize(18),
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: ScaleSize(24),
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(12),
  },
  sectionLabel: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '700',
    marginBottom: ScaleSize(10),
    marginTop: ScaleSize(24),
  },
  unitDivider: {
    backgroundColor: Colors.primary,
    height: ScaleSize(22),
    width: 1,
  },
  unitGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(10),
  },
  unitText: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(15),
  },
});
