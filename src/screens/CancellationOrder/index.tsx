import type { Paths } from '@navigation/paths';
import type { RootScreenProps } from '@navigation/types';

import { AppButton, HeaderDetail } from '@components';
import { Colors } from '@constants';
import { useCancellationOrder } from '@hooks';
import { ScaleSize } from '@kits/core';
import { DeviceUtils } from '@kits/core/utils';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import CancelNotice from './CancelNotice';
import OrderSummaryCard from './OrderSummaryCard';
import ReasonList from './ReasonList';

const { ifAndroid } = DeviceUtils;

const FOOTER_BOTTOM_ANDROID = ScaleSize(16);
const FOOTER_BOTTOM_IOS = ScaleSize(20);

function CancellationOrder(props: RootScreenProps<Paths.CancellationOrder>) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    disabledSubmit,
    onChangeOtherReason,
    onPressReason,
    onSubmit,
    otherReason,
    reasons,
    selectedReason,
    order,
  } = useCancellationOrder(props);

  return (
    <View style={styles.screen}>
      <HeaderDetail hideNotify title={t('cancellation_order.title')} />

      <ScrollView
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <OrderSummaryCard order={order} />

        <Text style={styles.heading}>
          {t('cancellation_order.reason_heading')}
        </Text>

        <ReasonList
          onChangeOtherReason={onChangeOtherReason}
          onPressReason={onPressReason}
          otherReason={otherReason}
          reasons={reasons}
          selected={selectedReason}
        />

        <View style={styles.noticeWrap}>
          <CancelNotice />
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: ifAndroid(
              FOOTER_BOTTOM_ANDROID,
              insets.bottom || FOOTER_BOTTOM_IOS,
            ),
          },
        ]}
      >
        <AppButton
          disabled={disabledSubmit}
          onPress={onSubmit}
          style={[styles.submitBtn, disabledSubmit && styles.submitBtnDisabled]}
          testID="cancellation-order-submit"
        >
          <Text style={styles.submitText}>
            {t('cancellation_order.submit')}
          </Text>
        </AppButton>
      </View>
    </View>
  );
}

export default CancellationOrder;

const styles = StyleSheet.create({
  backBtn: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.gray19,
    borderRadius: ScaleSize(14),
    borderWidth: ScaleSize(1),
    flex: 1,
    height: ScaleSize(52),
    justifyContent: 'center',
  },
  backText: {
    color: Colors.black01,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
  footer: {
    backgroundColor: Colors.white,
    borderTopColor: Colors.gray19,
    borderTopWidth: ScaleSize(1),
    flexDirection: 'row',
    gap: ScaleSize(12),
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(12),
  },
  heading: {
    color: Colors.black01,
    fontSize: ScaleSize(15),
    fontWeight: '700',
    marginBottom: ScaleSize(12),
    marginTop: ScaleSize(22),
  },
  noticeWrap: {
    marginTop: ScaleSize(20),
  },
  screen: {
    backgroundColor: Colors.gray10,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: ScaleSize(24),
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(16),
  },
  submitBtn: {
    alignItems: 'center',
    backgroundColor: Colors.red03,
    borderRadius: ScaleSize(14),
    flex: 1.4,
    height: ScaleSize(52),
    justifyContent: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: Colors.red05,
  },
  submitText: {
    color: Colors.white,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
});
