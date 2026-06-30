import { AppButton, Button, Image } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useEffect } from 'react';
import { getTotalItemCartRequest } from '@services/slices/account/accountSlice';
import { useAppDispatch } from '@services/common/storeHooks';
import imageNames from '@assets/images/names';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const GREEN_DARK = '#1A6B1A';
const TEXT_DARK = '#1A1A1A';
const TEXT_GRAY = '#717171';
const ICON_BG = '#E8F5E8';
const SCREEN_BG = '#F5FBF5';

type ConfettiItem = {
  color: string;
  height: number;
  id: number;
  rotation: number;
  width: number;
  x: number;
  y: number;
};

const CONFETTI: ConfettiItem[] = [
  { color: '#4CAF50', height: 8, id: 1, rotation: -30, width: 6, x: 30, y: 60 },
  {
    color: '#FFC107',
    height: 6,
    id: 2,
    rotation: 15,
    width: 10,
    x: 55,
    y: 110,
  },
  { color: '#2196F3', height: 8, id: 3, rotation: -45, width: 6, x: 68, y: 70 },
  {
    color: '#4CAF50',
    height: 10,
    id: 4,
    rotation: 20,
    width: 6,
    x: 310,
    y: 55,
  },
  {
    color: '#FFC107',
    height: 6,
    id: 5,
    rotation: -20,
    width: 10,
    x: 285,
    y: 100,
  },
  { color: '#2196F3', height: 8, id: 6, rotation: 40, width: 6, x: 330, y: 90 },
  {
    color: '#4CAF50',
    height: 6,
    id: 7,
    rotation: -10,
    width: 10,
    x: 100,
    y: 155,
  },
  {
    color: '#2196F3',
    height: 8,
    id: 8,
    rotation: 55,
    width: 6,
    x: 250,
    y: 145,
  },
];

function ConfettiBit({
  color,
  height,
  rotation,
  width,
  x,
  y,
}: Omit<ConfettiItem, 'id'>) {
  return (
    <View
      style={{
        height: height + 4,
        left: x,
        position: 'absolute',
        top: y,
        width: width + 4,
      }}
    >
      <View
        style={{
          backgroundColor: color,
          borderRadius: 2,
          height,
          transform: [{ rotate: `${rotation}deg` }],
          width,
        }}
      />
    </View>
  );
}

import type { IconName } from '@assets/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';

type InfoRowProps = {
  readonly icon: IconName;
  readonly label: string;
  readonly showChevron?: boolean;
  readonly showDivider?: boolean;
  readonly value: string;
};

function InfoRow({
  icon,
  label,
  showChevron = false,
  showDivider = true,
  value,
}: InfoRowProps) {
  return (
    <View>
      <View style={styles.infoRow}>
        <View style={styles.infoIconWrap}>
          <Image
            color={Colors.primary}
            height={ScaleSize(22)}
            name={icon}
            type="svg"
            width={ScaleSize(22)}
          />
        </View>
        <View style={styles.infoTextCol}>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoValue}>{value}</Text>
        </View>
        {showChevron ? (
          <View style={styles.chevronWrap}>
            <Image
              height={ScaleSize(16)}
              name="ic_chevron_right"
              type="svg"
              width={ScaleSize(16)}
            />
          </View>
        ) : undefined}
      </View>
      {showDivider ? <View style={styles.divider} /> : undefined}
    </View>
  );
}

function onGoToTranDetail() {}
function onGoToStores() {
  AppNavigator.reset(Paths.Stores);
}
function handleGoHome() {
  AppNavigator.reset(Paths.Home);
}

function OrderCompleted(props: any) {
  const { data, dataOrder } = AppNavigator.getParams(props);
  const inssets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleCopyCode = () => {
    // clipboard copy — placeholder
    Clipboard.setString(data?.orderNumber);
    AppNavigator.showSnackBar({
      message: t('order_history_detail.copy_order_number_success'),
      type: 'success',
    });
  };

  useEffect(() => {
    dispatch(getTotalItemCartRequest());
  }, [dispatch]);

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={[styles.hero, { paddingTop: inssets.top }]}>
          {CONFETTI.map(item => (
            <ConfettiBit key={item.id} {...item} />
          ))}
          <View style={styles.checkCircleOuter}>
            <Image
              height={ScaleSize(110)}
              name={imageNames.ic_success_check}
              resizeMode="contain"
              style={{
                marginRight: ScaleSize(13),
                marginBottom: ScaleSize(13),
              }}
              width={ScaleSize(110)}
            />
          </View>
          <Text style={styles.heroTitle}>{t('order_completed.title')}</Text>
          <Text style={styles.heroSubtitle}>
            {t('order_completed.subtitle')}
          </Text>
        </View>

        {/* Order info card */}
        <View style={styles.card}>
          {/* Order code row — special: has copy action */}
          <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
              <Image
                color={Colors.primary}
                height={ScaleSize(22)}
                name="ic_order_receipt"
                type="svg"
                width={ScaleSize(22)}
              />
            </View>
            <View style={styles.infoTextCol}>
              <Text style={styles.infoLabel}>
                {t('order_completed.order_code')}
              </Text>
              <Text style={[styles.infoValue, styles.orderCodeValue]}>
                {data?.orderNumber ?? ''}
              </Text>
            </View>
            <AppButton onPress={handleCopyCode} style={styles.copyBtn}>
              <Image
                color={Colors.primary}
                height={ScaleSize(20)}
                name="ic_copy"
                type="svg"
                width={ScaleSize(20)}
              />
              <Text style={styles.copyLabel}>{t('order_completed.copy')}</Text>
            </AppButton>
          </View>
          <View style={styles.divider} />

          <InfoRow
            icon="ic_calendar"
            label={t('order_completed.order_date')}
            value={dayjs(data?.paymentDueAt).format('DD/MM/YYYY HH:mm')}
          />
          <InfoRow
            icon="ic_map_pin"
            label={t('order_completed.delivery_address')}
            showChevron
            value={data?.address?.addressText ?? data?.address?.address_name}
          />
          <InfoRow
            icon="ic_truck"
            label={t('order_completed.shipping_method')}
            showChevron
            value={data?.deliveryMethod ?? dataOrder?.deliveryMethod ?? ''}
          />
          <InfoRow
            icon="ic_wallet"
            label={t('order_completed.payment_method')}
            showDivider={false}
            value={data?.paymentMethod ?? dataOrder?.paymentMethod ?? ''}
          />
        </View>

        {/* Notification banner */}
        <View style={styles.notifyBanner}>
          <View style={styles.notifyIconWrap}>
            <Image
              color={Colors.primary}
              height={ScaleSize(32)}
              name="ic_shield_check"
              type="svg"
              width={ScaleSize(32)}
            />
          </View>
          <View style={styles.notifyTextCol}>
            <Text style={styles.notifyTitle}>
              {t('order_completed.notify_title')}
            </Text>
            <Text style={styles.notifySubtitle}>
              {t('order_completed.notify_subtitle')}
            </Text>
          </View>
        </View>

        {/* Secondary actions */}
        <View style={styles.secondaryRow}>
          <AppButton onPress={onGoToTranDetail} style={styles.secondaryBtn}>
            <Image
              color={Colors.primary}
              height={ScaleSize(24)}
              name="ic_order_receipt"
              type="svg"
              width={ScaleSize(24)}
            />
            <Text style={styles.secondaryBtnLabel}>
              {t('order_completed.view_detail')}
            </Text>
          </AppButton>
          <AppButton onPress={onGoToStores} style={styles.secondaryBtn}>
            <Image
              color={Colors.primary}
              height={ScaleSize(24)}
              name="ic_shopping_bag"
              type="svg"
              width={ScaleSize(24)}
            />
            <Text style={styles.secondaryBtnLabel}>
              {t('order_completed.continue_shopping')}
            </Text>
          </AppButton>
        </View>
      </ScrollView>

      {/* Primary CTA */}
      <View style={[styles.bottomBar, { marginBottom: inssets.bottom }]}>
        <Button
          onPress={handleGoHome}
          testID="order-completed-home"
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: ScaleSize(16),
    marginHorizontal: ScaleSize(16),
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(4),
  },
  checkCircleOuter: {
    alignItems: 'center',
    backgroundColor: 'rgba(91,184,92,0.15)',
    borderRadius: 60,
    height: ScaleSize(110),
    justifyContent: 'center',
    marginBottom: ScaleSize(20),
    width: ScaleSize(110),
  },
  chevronWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: ScaleSize(4),
  },
  copyBtn: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(4),
    paddingLeft: ScaleSize(8),
  },
  copyLabel: {
    color: Colors.primary,
    fontSize: ScaleSize(14),
    fontWeight: '500',
  },
  divider: {
    backgroundColor: '#E5E7EB',
    height: 1,
    marginVertical: ScaleSize(2),
  },
  hero: {
    alignItems: 'center',
    paddingBottom: ScaleSize(24),
    paddingTop: ScaleSize(32),
  },
  heroSubtitle: {
    color: TEXT_GRAY,
    fontSize: ScaleSize(14),
    lineHeight: ScaleSize(22),
    marginTop: ScaleSize(8),
    textAlign: 'center',
  },
  heroTitle: {
    color: GREEN_DARK,
    fontSize: ScaleSize(24),
    fontWeight: '700',
    textAlign: 'center',
  },
  infoIconWrap: {
    alignItems: 'center',
    backgroundColor: ICON_BG,
    borderRadius: ScaleSize(20),
    height: ScaleSize(40),
    justifyContent: 'center',
    marginRight: ScaleSize(12),
    width: ScaleSize(40),
  },
  infoLabel: {
    color: TEXT_GRAY,
    fontSize: ScaleSize(12),
    marginBottom: ScaleSize(2),
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: ScaleSize(12),
  },
  infoTextCol: {
    flex: 1,
  },
  infoValue: {
    color: TEXT_DARK,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
  notifyBanner: {
    alignItems: 'center',
    backgroundColor: ICON_BG,
    borderRadius: ScaleSize(12),
    flexDirection: 'row',
    marginHorizontal: ScaleSize(16),
    marginTop: ScaleSize(12),
    padding: ScaleSize(16),
  },
  notifyIconWrap: {
    marginRight: ScaleSize(12),
  },
  notifySubtitle: {
    color: TEXT_GRAY,
    fontSize: ScaleSize(13),
    lineHeight: ScaleSize(18),
  },
  notifyTextCol: {
    flex: 1,
  },
  notifyTitle: {
    color: Colors.primary,
    fontSize: ScaleSize(14),
    fontWeight: '600',
    marginBottom: ScaleSize(2),
  },
  orderCodeValue: {
    color: Colors.primary,
    fontSize: ScaleSize(16),
  },
  safeArea: {
    backgroundColor: SCREEN_BG,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: ScaleSize(16),
  },
  secondaryBtn: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: ScaleSize(12),
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: ScaleSize(8),
    justifyContent: 'center',
    paddingVertical: ScaleSize(14),
  },
  secondaryBtnLabel: {
    color: TEXT_DARK,
    fontSize: ScaleSize(13),
    fontWeight: '500',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: ScaleSize(10),
    marginHorizontal: ScaleSize(16),
    marginTop: ScaleSize(12),
  },
});
