import { Image, AppButton, CheckBox, Button, HeaderDetail } from '@components';
import TextField from '@components/TextField';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const DATA_DEFAULT = [
  {
    id: 1,
    fakeName: '3,00원 할인 쿠폰',
    name: '카페 COOP 전 음료 1잔 무료',
    expiredDate: '2026-04-12T10:00:00',
  },
  {
    id: 2,
    fakeName: '10% 할인 쿠폰',
    name: '매장 전체 10% 할인',
    expiredDate: '2026-04-20T10:00:00',
  },
  {
    id: 3,
    fakeName: '무료배송 쿠폰',
    name: '스마트오더 배송비 무료',
    expiredDate: '2026-04-18T10:00:00',
  },
];

const ICON_SIZE = ScaleSize(22);
const ACCENT_BAR = Colors.primary;
const TEXT_DARK = '#1A1A1A';

const VoucherItem = ({ data, selected, onSelect }: any) => {
  return (
    <View style={styles.card}>
      <View style={styles.accentBar} />
      <AppButton style={styles.content} onPress={() => onSelect(data)}>
        <View
          style={{
            maxWidth: '80%',
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
              {data?.fakeName}
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
  const { onRequestClose, onSubmit, data = DATA_DEFAULT } = props || {};
  const { t } = useTranslation();
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherSelected, setVoucherSelected] = useState();
  const onCheckVoucher = () => {};
  const renderItem = useCallback(
    ({ item }) => (
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
      }}
    >
      <HeaderDetail
        hideNotify
        usePaddingTop={false}
        title={t('vouchers.select_title')}
        onPressBack={onRequestClose}
      />
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
          <AppButton disabled={!voucherCode} onPress={onCheckVoucher}>
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

      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={1.5}
        contentContainerStyle={styles.contentList}
        style={{
          flex: 1,
          backgroundColor: '#f4f4f4',
        }}
      />

      <Button
        title={t('vouchers.apply')}
        disabled={!voucherSelected}
        onPress={() => onSubmit?.(voucherSelected)}
        style={{
          width: '90%',
          alignSelf: 'center',
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
