import type { IOrderHistoryDetailItem, IOrderSummary } from '@type';
import type { TranslationKeys } from '@translations/i18next';

import { AmountRow, DashedDivider } from '@components';
import { Colors } from '@constants';
import { View } from 'react-native';
import { formatCurrency } from '@utils/product';
import { useTranslation } from 'react-i18next';
import React, { useMemo } from 'react';

import SectionCard from './SectionCard';
import { EMPTY_VALUE, sharedStyles } from './theme';

type DiscountKey = 'couponPrice' | 'memberDiscountPrice' | 'usedPointPrice';

type Properties = {
  readonly couponName?: string;
  readonly order?: IOrderHistoryDetailItem;
  readonly summaryPrice?: IOrderSummary;
};

// Rendered in this order whenever the summary carries a value above zero.
const DISCOUNT_KEYS: readonly DiscountKey[] = [
  'couponPrice',
  'memberDiscountPrice',
  'usedPointPrice',
];
const NO_DISCOUNT = 0;

function PaymentInfoSection({
  couponName = undefined,
  order = undefined,
  summaryPrice = undefined,
}: Properties) {
  const { t } = useTranslation();

  const discounts = useMemo(
    () =>
      DISCOUNT_KEYS.filter(
        key => (summaryPrice?.[key] ?? NO_DISCOUNT) > NO_DISCOUNT,
      ).map(key => ({
        amount: summaryPrice?.[key],
        key,
      })),
    [summaryPrice],
  );

  const captionOf = (key: DiscountKey, amount: number) => {
    if (key === 'couponPrice') {
      return couponName;
    }
    // if (key === 'usedPointPrice') {
    //   return `${formatCurrency(amount)}${POINT_UNIT}`;
    // }
    return undefined;
  };

  const paymentMethod = order?.paymentFundingSource
    ? t('order_history_detail.price_detail.paymentMethod', {
        method: t(
          `order_history_detail.payment_methods.${order?.paymentFundingSource.toLowerCase()}`,
        ),
      })
    : EMPTY_VALUE;

  return (
    <SectionCard
      iconName="ic_order_receipt"
      title={t('order_history_detail.payment_summary_section_title')}
    >
      <AmountRow
        bold
        label={t('order_history_detail.original_total_label')}
        value={t('common.display_price', {
          amount: formatCurrency(summaryPrice?.totalPrice),
        })}
      />

      <View style={sharedStyles.divider} />

      {discounts.map(({ amount, key }, index) => (
        <View key={key}>
          <AmountRow
            caption={captionOf(key, amount)}
            label={t(
              `order_history_detail.price_detail.${key}` as TranslationKeys,
            )}
            value={`-${t('common.display_price', {
              amount: formatCurrency(amount),
            })}`}
            valueColor={Colors.red01}
          />
          {index < discounts.length - 1 ? <DashedDivider /> : undefined}
        </View>
      ))}

      <AmountRow
        highlight
        label={t('order_history_detail.actual_payment_label')}
        value={t('common.display_price', {
          amount: formatCurrency(summaryPrice?.finalPrice),
        })}
      />
      <AmountRow
        label={paymentMethod}
        value={`-${t('common.display_price', {
          amount: formatCurrency(summaryPrice?.finalPrice),
        })}`}
        valueColor={Colors.green02}
      />
    </SectionCard>
  );
}

export default React.memo(PaymentInfoSection);
