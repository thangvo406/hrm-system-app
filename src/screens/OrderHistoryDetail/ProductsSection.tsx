import type { IProduct } from '@type/products';

import { AppButton, Image } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import React from 'react';

import ProductRow from './ProductRow';
import SectionCard from './SectionCard';
import { PRODUCT_PREVIEW_COUNT } from './theme';

type Properties = {
  readonly onToggleShowAll: () => void;
  readonly showAllProducts: boolean;
  readonly totalProducts: number;
  readonly visibleProducts?: IProduct[];
};

const CHEVRON_SIZE = ScaleSize(16);

function ProductsSection({
  onToggleShowAll,
  showAllProducts,
  totalProducts,
  visibleProducts = undefined,
}: Properties) {
  const { t } = useTranslation();

  return (
    <SectionCard
      iconName="ic_shopping_bag"
      title={t('order_history_detail.products_label')}
    >
      {visibleProducts?.map(product => (
        <ProductRow key={product.id} product={product} />
      ))}

      {totalProducts > PRODUCT_PREVIEW_COUNT ? (
        <AppButton
          onPress={onToggleShowAll}
          style={styles.showMoreBtn}
          testID="order-detail-toggle-products"
        >
          <Text style={styles.showMoreLabel}>
            {showAllProducts
              ? t('order_history_detail.show_less')
              : t('order_history_detail.show_more')}
          </Text>
          <View style={showAllProducts ? styles.chevronUp : undefined}>
            <Image
              color={Colors.primary}
              height={CHEVRON_SIZE}
              name="ic_chevron_down"
              type="svg"
              width={CHEVRON_SIZE}
            />
          </View>
        </AppButton>
      ) : undefined}
    </SectionCard>
  );
}

export default React.memo(ProductsSection);

const styles = StyleSheet.create({
  chevronUp: {
    transform: [{ rotate: '180deg' }],
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
});
