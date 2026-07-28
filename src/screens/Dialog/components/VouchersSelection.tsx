import {
  Image,
  AppButton,
  CheckBox,
  Button,
  HeaderDetail,
  VouchersSelectionLoading,
} from '@components';
import TextField from '@components/TextField';
import { Colors } from '@constants';
import { VOUCHER_TYPES } from '@constants/config';
import { useVouchersSelection } from '@hooks/useVouchersSelection';
import { ScaleSize } from '@kits/core';
import { formatCurrency } from '@utils/product';
import { debounce } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const ICON_SIZE = ScaleSize(22);
const ACCENT_BAR = Colors.primary;
const TEXT_DARK = '#1A1A1A';

const SearchView = ({ onCheckVoucher }: any) => {
  const [voucherCode, setVoucherCode] = useState();
  const { t } = useTranslation();
  const _onCheckVoucher = () => {
    onCheckVoucher(voucherCode);
  };
  return (
    <TextField
      autoCapitalize="none"
      defaultValue=""
      onChangeText={debounce(setVoucherCode, 350)}
      onSubmitEditing={onCheckVoucher}
      placeholder={t('vouchers.search_code_placeholder')}
      returnKeyType="done"
      submitBehavior="submit"
      containerStyle={{
        marginHorizontal: ScaleSize(16),
        paddingVertical: ScaleSize(20),
      }}
      renderRightComponent={() => (
        <AppButton disabled={!voucherCode} onPress={_onCheckVoucher}>
          <Text
            style={{
              fontSize: ScaleSize(12),
              color: Colors.primary,
              fontWeight: 'bold',
            }}
          >
            {t('vouchers.check')}
          </Text>
        </AppButton>
      )}
    />
  );
};

const VoucherItem = ({ data, selected, onSelect }: any) => {
  const { t } = useTranslation();
  const name = useMemo(() => {
    if (data?.type == VOUCHER_TYPES.RATE) {
      return t('vouchers.name_rate', { rate: data?.discountRate });
    } else if (data?.type == VOUCHER_TYPES.AMOUNT) {
      return t('vouchers.name_amount', {
        amount: formatCurrency(data?.discountAmount),
      });
    }
    return '';
  }, [data]);

  return (
    <View style={styles.card}>
      <View style={styles.accentBar} />
      <AppButton style={styles.content} onPress={() => onSelect(data)}>
        <View
          style={{
            flex: 1,
            marginRight: ScaleSize(10),
          }}
        >
          <View style={styles.headerRow}>
            <Image
              color={ACCENT_BAR}
              height={ICON_SIZE}
              name="ic_coupon"
              type="svg"
              width={ICON_SIZE}
            />
            <Text numberOfLines={1} style={styles.title}>
              {name}
            </Text>
          </View>

          <Text style={styles.description}>{data?.name}</Text>
        </View>

        <CheckBox selected={selected} />
      </AppButton>
    </View>
  );
};

const keyExtractor = (item: any) => String(item.id);

function VouchersSelection(props: any) {
  const { t } = useTranslation();
  const { onRequestClose } = props || {};
  const {
    data: vouchers,
    onApply,
    onCheckVoucher,
    setVoucherSelected,
    onLoadMore,
    loading,
    voucherSelected,
  } = useVouchersSelection(props);
  const renderItem = useCallback(
    ({ item }: any) => (
      <VoucherItem
        data={item}
        onSelect={setVoucherSelected}
        selected={item.id == voucherSelected?.id}
      />
    ),
    [voucherSelected],
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}
    >
      <HeaderDetail
        hideNotify
        usePaddingTop={false}
        title={t('vouchers.select_title')}
        onPressBack={onRequestClose}
      />
      <SearchView onCheckVoucher={onCheckVoucher} />
      {loading ? (
        <VouchersSelectionLoading />
      ) : (
        <FlatList
          data={vouchers}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={1.5}
          onEndReached={onLoadMore}
          contentContainerStyle={styles.contentList}
          style={{
            flex: 1,
            backgroundColor: '#f4f4f4',
          }}
        />
      )}

      <Button
        title={t('vouchers.apply')}
        disabled={!voucherSelected}
        onPress={onApply}
        style={{
          width: '90%',
          alignSelf: 'center',
          bottom: 20,
        }}
      />
    </View>
  );
}
export default VouchersSelection;

const styles = StyleSheet.create({
  accentBar: {
    backgroundColor: ACCENT_BAR,
    borderBottomLeftRadius: ScaleSize(14),
    borderTopLeftRadius: ScaleSize(14),
    width: ScaleSize(6),
  },
  contentList: {
    flexGrow: 1,
    paddingBottom: ScaleSize(32),
    paddingHorizontal: ScaleSize(16),

    paddingTop: ScaleSize(16),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(14),
    elevation: 3,
    flexDirection: 'row',
    marginBottom: ScaleSize(16),
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  titleHeader: {
    color: '#1A1A1A',
    fontSize: ScaleSize(17),
    fontWeight: '700',
    marginBottom: ScaleSize(20),
    paddingHorizontal: ScaleSize(16),
  },
  content: {
    flex: 1,
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(14),
    // borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(8),
  },
  title: {
    color: TEXT_DARK,
    flex: 1,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  description: {
    color: TEXT_DARK,
    fontSize: ScaleSize(14),
    marginTop: ScaleSize(10),
  },
});
