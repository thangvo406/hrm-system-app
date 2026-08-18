import type { Theme } from '../theme';

import { AppButton, Image } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';

import InfoRow from './InfoRow';
import { useAppSelector } from '@services/common/storeHooks';
import { AppSelector } from '@services/selectors';

type OrderInfoData = {
  readonly address?: { readonly address_name?: string };
  readonly deliveryMethod?: string;
  readonly orderNumber?: string;
  readonly paymentDueAt?: string;
  readonly paymentMethod?: string;
  readonly storeAddress?: { readonly address_name?: string };
};

type FallbackData = {
  readonly deliveryMethod?: string;
  readonly paymentMethod?: string;
};

type InfoCardProps = {
  readonly data?: OrderInfoData;
  readonly fallback?: FallbackData;
  readonly onCopyCode: () => void;
  readonly theme: Theme;
};

function InfoCard({
  data = undefined,
  fallback = undefined,
  onCopyCode,
  theme,
}: InfoCardProps) {
  const { t } = useTranslation();
  const isEnableAddress = useAppSelector(AppSelector.isEnableAddress);
  const address = !isEnableAddress
    ? ''
    : (data?.address?.address_name ?? data?.storeAddress?.address_name ?? '');
  return (
    <View style={styles.card}>
      <InfoRow
        icon="ic_order_receipt"
        label={t('order_completed.order_code')}
        theme={theme}
        value={data?.orderNumber ?? ''}
        valueColor={theme.accent}
        valueSize={16}
      >
        <AppButton onPress={onCopyCode} style={styles.copyBtn}>
          <Image
            color={theme.accent}
            height={ScaleSize(20)}
            name="ic_copy"
            type="svg"
            width={ScaleSize(20)}
          />
          <Text style={[styles.copyLabel, { color: theme.accent }]}>
            {t('order_completed.copy')}
          </Text>
        </AppButton>
      </InfoRow>
      <InfoRow
        icon="ic_calendar"
        label={t('order_completed.order_date')}
        theme={theme}
        value={dayjs(data?.paymentDueAt).format('DD/MM/YYYY HH:mm')}
      />
      {address?.length > 0 && (
        <InfoRow
          icon="ic_map_pin"
          label={t('order_completed.delivery_address')}
          theme={theme}
          value={address}
        />
      )}

      <InfoRow
        icon="ic_truck"
        label={t('order_completed.shipping_method')}
        theme={theme}
        value={t(
          `order_history_detail.shipping_methods.${(data?.deliveryMethod ?? fallback?.deliveryMethod ?? '').toLowerCase()}`,
        )}
      />
      <InfoRow
        icon="ic_wallet"
        label={t('order_completed.payment_method')}
        showDivider={false}
        theme={theme}
        value={data?.paymentMethod ?? fallback?.paymentMethod ?? ''}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: ScaleSize(16),
    marginHorizontal: ScaleSize(16),
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(4),
  },
  copyBtn: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(4),
    paddingLeft: ScaleSize(8),
  },
  copyLabel: {
    fontSize: ScaleSize(14),
    fontWeight: '500',
  },
});

export default React.memo(InfoCard);
