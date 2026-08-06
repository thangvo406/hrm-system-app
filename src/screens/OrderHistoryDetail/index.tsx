import { Colors } from '@constants';
import { HeaderDetail, OrderHistoryDetailLoading } from '@components';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOrderHistoryDetail } from '@hooks';

import BottomActions from './BottomActions';
import DeliveryInfoSection from './DeliveryInfoSection';
import OrderSummaryCard from './OrderSummaryCard';
import PaymentInfoSection from './PaymentInfoSection';
import ProductsSection from './ProductsSection';

// TODO(feature): wire the reorder / contact-support actions.
const noop = () => {};

function OrderHistoryDetail(props: any) {
  const insets = useSafeAreaInsets();
  const {
    data,
    loading,
    showAllProducts,
    toggleShowAllProducts,
    visibleProducts,
    isSuccess,
    onPressCopyOrderNumber,
    storeName,
  } = useOrderHistoryDetail(props);

  return (
    <View style={styles.root}>
      <HeaderDetail title={storeName} />
      {loading ? (
        <OrderHistoryDetailLoading />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + ScaleSize(80) },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <OrderSummaryCard
              isSuccess={isSuccess}
              onPressCopyOrderNumber={onPressCopyOrderNumber}
              order={data}
            />
            <DeliveryInfoSection order={data} />
            <ProductsSection
              onToggleShowAll={toggleShowAllProducts}
              showAllProducts={showAllProducts}
              totalProducts={data?.products?.length ?? 0}
              visibleProducts={visibleProducts}
            />
            <PaymentInfoSection order={data} summaryPrice={data?.summary} />
          </ScrollView>

          <BottomActions onPressContactSupport={noop} onPressReorder={noop} />
        </>
      )}
    </View>
  );
}

export default OrderHistoryDetail;

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.gray22,
    flex: 1,
  },
  scrollContent: {
    paddingTop: ScaleSize(10),
  },
});
