import type { IconName } from '@assets/icons';
import type { Product } from '@type/products';
// IconName is used via SectionCardProps below

import { AppButton, Button, HeaderDetail, Image } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatCurrency } from '@utils/product';
import { useOrderHistoryDetail } from '@hooks';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import imageNames from '@assets/images/names';

const TEXT_DARK = '#1A1A1A';
const TEXT_GRAY = '#9E9E9E';
const TEXT_LABEL = '#717171';
const SCREEN_BG = '#F7F7F7';
const CARD_BG = '#FFFFFF';
const ICON_BG = '#E8F5E8';
const STATUS_COMPLETED_BG = '#E8F5E8';
const STATUS_COMPLETED_TEXT = '#2E7D32';
const STATUS_PENDING_BG = '#FFF8E1';
const STATUS_PENDING_TEXT = '#F59E0B';
const STATUS_DEFAULT_BG = '#F3F4F6';
const STATUS_DEFAULT_TEXT = '#6B7280';
const DIVIDER = '#E5E7EB';
const THUMB_SIZE = ScaleSize(64);
const SECTION_ICON_SIZE = ScaleSize(40);

type SectionCardProps = {
  readonly iconName: IconName;
  readonly title: string;
  readonly children: React.ReactNode;
};

function SectionCard({ iconName, title, children }: SectionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconWrap}>
          <Image
            color={Colors.primary}
            height={ScaleSize(22)}
            name={iconName}
            type="svg"
            width={ScaleSize(22)}
          />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

type InfoRowProps = {
  readonly label: string;
  readonly value: string;
  readonly valueStyle?: object;
  readonly showDivider?: boolean;
};

function InfoRow({
  label,
  value,
  valueStyle,
  showDivider = true,
}: InfoRowProps) {
  return (
    <View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, valueStyle]}>{value}</Text>
      </View>
      {showDivider ? <View style={styles.divider} /> : undefined}
    </View>
  );
}

type ProductRowProps = {
  readonly product: Product;
};

function ProductRow({ product }: ProductRowProps) {
  return (
    <View style={styles.productRow}>
      <View style={styles.productThumb}>
        {product.imageUrl ? (
          <Image url={product.imageUrl} width="100%" height="100%" />
        ) : (
          <View style={styles.productThumbPlaceholder} />
        )}
      </View>
      <View style={styles.productContent}>
        <Text style={styles.productName}>{product.name}</Text>
        {product.selectedAttributes?.map(item => (
          <Text key={item.attributeItemId} style={styles.productAttr}>
            {item.attributeName}
          </Text>
        ))}
        <Text style={styles.productQty}>x{product?.quantity}</Text>
      </View>
      <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
    </View>
  );
}

function OrderHistoryDetail(props: any) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { data, showAllProducts, toggleShowAllProducts, visibleProducts, onPressCopyOrderNumber } =
    useOrderHistoryDetail(props);

  return (
    <View style={styles.root}>
      <HeaderDetail title={data?.storeName} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + ScaleSize(80) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Order summary card */}
        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryIconWrap}>
              <Image
                color={Colors.primary}
                height={ScaleSize(28)}
                name="ic_order_receipt"
                type="svg"
                width={ScaleSize(28)}
              />
            </View>
            <View style={styles.summaryMeta}>
              <Text style={styles.summaryMetaLabel}>
                {t('order_history_detail.order_code_label')}
              </Text>
              <View style={styles.codeRow}>
                <Text style={styles.orderCode}>{data?.orderNumber}</Text>
                <AppButton
                  style={styles.copyIcon}
                  onPress={onPressCopyOrderNumber}
                >
                  <Image
                    color={Colors.primary}
                    height={ScaleSize(18)}
                    name="ic_copy"
                    type="svg"
                    width={ScaleSize(18)}
                  />
                </AppButton>
              </View>
              <Text style={styles.orderTime}>
                {dayjs(data?.orderedAt).format('YYYY-MM-DD hh:mmA')}
              </Text>
            </View>
            <View style={styles.summaryRight}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      data?.status === 'COMPLETED'
                        ? STATUS_COMPLETED_BG
                        : data?.status === 'PENDING'
                          ? STATUS_PENDING_BG
                          : STATUS_DEFAULT_BG,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        data?.status === 'COMPLETED'
                          ? STATUS_COMPLETED_TEXT
                          : data?.status === 'PENDING'
                            ? STATUS_PENDING_TEXT
                            : STATUS_DEFAULT_TEXT,
                    },
                  ]}
                >
                  {data?.status === 'COMPLETED'
                    ? t('order_history_detail.status_completed')
                    : data?.status === 'PENDING'
                      ? t('order_history_detail.status_pending')
                      : data?.status}
                </Text>
              </View>
              <Text style={styles.totalLabel}>
                {t('order_history_detail.total_label')}
              </Text>
              <Text style={styles.totalAmount}>
                {formatCurrency(data?.summary.totalPrice)}
              </Text>
              <Text style={styles.paymentMethodNote}>{'paymentMethod'}</Text>
            </View>
          </View>
        </View>

        {/* Delivery info */}
        <SectionCard
          iconName="ic_map_pin"
          title={t('order_history_detail.delivery_section_title')}
        >
          <View style={styles.deliveryRecipientRow}>
            <View>
              <Text style={styles.infoLabel}>
                {t('order_history_detail.recipient_label')}
              </Text>
              <Text style={styles.recipientName}>{data?.userName}</Text>
            </View>
            <View style={styles.phoneRow}>
              <Image
                name={imageNames.ic_phone}
                width={ScaleSize(16)}
                height={ScaleSize(16)}
              />
              <Text style={styles.phoneText}>{data?.userPhone}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.deliveryFieldBlock}>
            <Text style={styles.infoLabel}>
              {t('order_history_detail.delivery_address_label')}
            </Text>
            <Text style={styles.deliveryValue}>
              {data?.address?.address_name}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.deliveryFieldBlock}>
            <Text style={styles.infoLabel}>
              {t('order_history_detail.shipping_method_label')}
            </Text>
            <Text style={styles.deliveryValue}>{data?.orderReceiveMethod}</Text>
          </View>
        </SectionCard>

        {/* Products */}
        <SectionCard
          iconName="ic_shopping_bag"
          title={t('order_history_detail.products_label')}
        >
          {visibleProducts?.map(product => (
            <ProductRow key={product.id} product={product} />
          ))}
          {data?.products?.length > 3 ? (
            <AppButton
              onPress={toggleShowAllProducts}
              style={styles.showMoreBtn}
            >
              <Text style={styles.showMoreLabel}>
                {showAllProducts
                  ? t('order_history_detail.show_less')
                  : t('order_history_detail.show_more')}
              </Text>
              <View style={showAllProducts ? styles.chevronUp : undefined}>
                <Image
                  color={Colors.primary}
                  height={ScaleSize(16)}
                  name="ic_chevron_down"
                  type="svg"
                  width={ScaleSize(16)}
                />
              </View>
            </AppButton>
          ) : undefined}
        </SectionCard>

        {/* Payment info */}
        <SectionCard
          iconName="ic_wallet"
          title={t('order_history_detail.payment_section_title')}
        >
          <InfoRow
            label={t('order_history_detail.payment_method_label')}
            value={data?.paymentMethod}
          />
          <InfoRow
            label={t('order_history_detail.subtotal_label')}
            value={formatCurrency(data?.summary?.totalPrice)}
          />
          <InfoRow
            label={t('order_history_detail.shipping_fee_label')}
            value={t('order_history_detail.shipping_fee_free')}
            showDivider={false}
          />
          <View style={[styles.divider, { marginTop: ScaleSize(12) }]} />
          <View style={styles.totalRow}>
            <Text style={styles.totalRowLabel}>
              {t('order_history_detail.total_label')}
            </Text>
            <Text style={styles.totalRowAmount}>
              {formatCurrency(data?.summary?.finalPrice)}
            </Text>
          </View>
        </SectionCard>
      </ScrollView>

      {/* Bottom actions */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: insets.bottom + ScaleSize(8) },
        ]}
      >
        <Button
          onPress={() => {}}
          style={styles.reorderBtn}
          testID="order-detail-reorder"
          title={t('order_history_detail.reorder')}
          type="outline-bordered"
        />
        <Button
          onPress={() => {}}
          style={styles.supportBtn}
          testID="order-detail-support"
          title={t('order_history_detail.contact_support')}
          type="rounded"
        />
      </View>
    </View>
  );
}

export default OrderHistoryDetail;

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: CARD_BG,
    borderTopColor: DIVIDER,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: ScaleSize(10),
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(10),
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: ScaleSize(12),
    marginBottom: ScaleSize(10),
    marginHorizontal: ScaleSize(12),
    padding: ScaleSize(16),
  },
  chevronUp: {
    transform: [{ rotate: '180deg' }],
  },
  codeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(6),
    marginTop: ScaleSize(2),
  },
  copyIcon: {
    padding: ScaleSize(2),
  },
  deliveryFieldBlock: {
    paddingVertical: ScaleSize(10),
  },
  deliveryRecipientRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: ScaleSize(10),
  },
  deliveryValue: {
    color: TEXT_DARK,
    fontSize: ScaleSize(14),
    fontWeight: '500',
    marginTop: ScaleSize(4),
  },
  divider: {
    backgroundColor: DIVIDER,
    height: 1,
  },
  infoLabel: {
    color: TEXT_LABEL,
    fontSize: ScaleSize(12),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: ScaleSize(10),
  },
  infoValue: {
    color: TEXT_DARK,
    fontSize: ScaleSize(14),
    fontWeight: '400',
    textAlign: 'right',
    flex: 1,
    marginLeft: ScaleSize(12),
  },
  orderCode: {
    color: Colors.primary,
    fontSize: ScaleSize(14),
    fontWeight: '700',
  },
  orderTime: {
    color: TEXT_GRAY,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(4),
  },
  paymentMethodNote: {
    color: TEXT_GRAY,
    fontSize: ScaleSize(11),
    marginTop: ScaleSize(2),
    textAlign: 'right',
  },
  phoneRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(4),
  },
  phoneText: {
    color: TEXT_DARK,
    fontSize: ScaleSize(14),
    fontWeight: '500',
  },
  productAttr: {
    color: TEXT_GRAY,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(2),
  },
  productContent: {
    flex: 1,
    marginLeft: ScaleSize(10),
  },
  productName: {
    color: TEXT_DARK,
    fontSize: ScaleSize(14),
    fontWeight: '500',
  },
  productPrice: {
    color: TEXT_DARK,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
  productQty: {
    color: TEXT_GRAY,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(2),
  },
  productRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingVertical: ScaleSize(10),
  },
  productThumb: {
    backgroundColor: '#F0F0F0',
    borderRadius: ScaleSize(8),
    height: THUMB_SIZE,
    overflow: 'hidden',
    width: THUMB_SIZE,
  },
  productThumbPlaceholder: {
    backgroundColor: '#E0E0E0',
    flex: 1,
  },
  recipientName: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '600',
    marginTop: ScaleSize(2),
  },
  reorderBtn: {
    flex: 1,
  },
  root: {
    backgroundColor: SCREEN_BG,
    flex: 1,
  },
  scrollContent: {
    paddingTop: ScaleSize(10),
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(10),
    marginBottom: ScaleSize(14),
  },
  sectionIconWrap: {
    alignItems: 'center',
    backgroundColor: ICON_BG,
    borderRadius: SECTION_ICON_SIZE / 2,
    height: SECTION_ICON_SIZE,
    justifyContent: 'center',
    width: SECTION_ICON_SIZE,
  },
  sectionTitle: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '600',
  },
  showMoreBtn: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(4),
    justifyContent: 'center',
    marginTop: ScaleSize(8),
    paddingVertical: ScaleSize(6),
  },
  showMoreLabel: {
    color: Colors.primary,
    fontSize: ScaleSize(14),
    fontWeight: '500',
  },
  statusBadge: {
    alignSelf: 'flex-end',
    borderRadius: ScaleSize(20),
    marginBottom: ScaleSize(8),
    paddingHorizontal: ScaleSize(12),
    paddingVertical: ScaleSize(4),
  },
  statusText: {
    fontSize: ScaleSize(12),
    fontWeight: '600',
  },
  summaryIconWrap: {
    alignItems: 'center',
    backgroundColor: ICON_BG,
    borderRadius: ScaleSize(24),
    height: ScaleSize(48),
    justifyContent: 'center',
    marginRight: ScaleSize(12),
    width: ScaleSize(48),
  },
  summaryMeta: {
    flex: 1,
  },
  summaryMetaLabel: {
    color: TEXT_GRAY,
    fontSize: ScaleSize(12),
  },
  summaryRight: {
    alignItems: 'flex-end',
    marginLeft: ScaleSize(8),
  },
  summaryRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  supportBtn: {
    flex: 1,
  },
  totalAmount: {
    color: TEXT_DARK,
    fontSize: ScaleSize(18),
    fontWeight: '700',
  },
  totalLabel: {
    color: TEXT_GRAY,
    fontSize: ScaleSize(12),
  },
  totalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: ScaleSize(12),
  },
  totalRowAmount: {
    color: Colors.primary,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  totalRowLabel: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '600',
  },
});
