import type { OrderStatus } from './theme';

import { Button } from '@components';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useCallback, useEffect, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import AppNavigator from '@navigation/AppNavigator';
import Clipboard from '@react-native-clipboard/clipboard';
import { Paths } from '@navigation/paths';
import {
  getCurrentWalletRequest,
  getTotalItemCartRequest,
} from '@services/slices/account/accountSlice';
import { useAppDispatch } from '@services/common/storeHooks';

import Hero from './components/Hero';
import InfoCard from './components/InfoCard';
import NotifyBanner from './components/NotifyBanner';
import SecondaryActions from './components/SecondaryActions';
import { THEMES } from './theme';

function OrderCompleted(props: any) {
  const { data, dataOrder, status } = AppNavigator.getParams(props) as {
    data?: any;
    dataOrder?: {
      deliveryMethod?: string;
      paymentMethod?: string;
      totalAmount: number;
    };
    status?: OrderStatus;
  };
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const theme = THEMES[status ?? 'success'] ?? THEMES.success;

  useEffect(() => {
    dispatch(getTotalItemCartRequest());
    dispatch(getCurrentWalletRequest());
  }, [dispatch]);

  const handleCopyCode = useCallback(() => {
    Clipboard.setString(data?.orderNumber ?? '');
    AppNavigator.showSnackBar({
      message: t('order_history_detail.copy_order_number_success'),
      type: 'success',
    });
  }, [data?.orderNumber, t]);

  const handleGoHome = useCallback(() => {
    AppNavigator.reset(Paths.AppTabs, { screen: Paths.Home });
  }, []);

  const secondaryActions = useMemo(
    () =>
      [
        {
          handlePress: () => {
            AppNavigator.navigate(Paths.OrderHistoryDetail, { data });
          },
          icon: 'ic_order_receipt' as const,
          label: t('order_completed.view_detail'),
          testID: 'order-result-view-detail',
        },
        {
          handlePress: () => AppNavigator.reset(Paths.Stores),
          icon: 'ic_shopping_bag' as const,
          label: t('order_completed.continue_shopping'),
          testID: 'order-result-continue-shopping',
        },
      ] as const,
    [t],
  );

  return (
    <View style={[styles.safeArea, { backgroundColor: theme.screenBg }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Hero
          paddingTop={insets.top}
          subtitle={t(`${theme.i18nBase}.subtitle`)}
          theme={theme}
          totalAmount={dataOrder?.totalAmount}
          title={t(`${theme.i18nBase}.title`)}
        />
        <InfoCard
          data={data}
          fallback={dataOrder}
          onCopyCode={handleCopyCode}
          theme={theme}
        />
        <NotifyBanner
          subtitle={t(`${theme.i18nBase}.notify_subtitle`)}
          theme={theme}
          title={t(`${theme.i18nBase}.notify_title`)}
        />
        <SecondaryActions actions={secondaryActions} theme={theme} />
      </ScrollView>
      <View style={[styles.bottomBar, { marginBottom: insets.bottom }]}>
        <Button
          onPress={handleGoHome}
          style={{
            backgroundColor: theme.accent,
            shadowColor: theme.accent,
          }}
          testID="order-result-home"
          title={t('order_completed.go_home')}
          type="primary"
        />
      </View>
    </View>
  );
}

export default OrderCompleted;

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: '#FFFFFF',
    paddingBottom: ScaleSize(12),
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(8),
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: ScaleSize(16),
  },
});
