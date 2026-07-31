import type { IconName } from '@assets/icons';

import { AppButton, Button, HeaderDetail, Image } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppNavigator from '@navigation/AppNavigator';
import InputAddress from '@screens/InputAddress';
import { DeviceUtils } from '@kits/core/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_BG = '#F2F2F2';
const TEXT_DARK = '#1A1A1A';
const ICON_TINT = '#6B6B6B';
const METHOD_ICON_SIZE = ScaleSize(34);

type OrderMethod = 'DELIVERY' | 'HALL' | 'PICKUP';
const { isAndroid } = DeviceUtils;
const ORDER_METHODS: readonly {
  readonly desc: string;
  readonly icon: IconName;
  readonly id: OrderMethod;
  readonly label: string;
}[] = [
  {
    desc: 'order_method.method_delivery_desc',
    icon: 'ic_truck',
    id: 'DELIVERY',
    label: 'order_method.method_delivery',
  },
  {
    desc: 'order_method.method_pickup_desc',
    icon: 'ic_shopping_bag',
    id: 'PICKUP',
    label: 'order_method.method_pickup',
  },
  {
    desc: 'order_method.method_dinein_desc',
    icon: 'ic_store',
    id: 'HALL',
    label: 'order_method.method_dinein',
  },
];

type ShippingProperties = {
  readonly onSelectMethod?: (method: OrderMethod) => void;
  readonly onSubmit?: (data: any) => void;
  readonly onRequestClose: () => void;
  readonly addressOrderRecent: any;
  readonly data: any;
};

function Shipping({
  onRequestClose,
  addressOrderRecent,
  onSubmit,
  onSelectMethod,
  data,
}: ShippingProperties) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<OrderMethod>('DELIVERY');
  const [addressDelivery, setAddressDelivery] = useState(addressOrderRecent);
  const insets = useSafeAreaInsets();

  const getAddressDisplay = () => {
    return (
      addressDelivery?.address?.roadAddress ||
      addressDelivery?.address?.landAddress ||
      addressDelivery?.address_name ||
      '--'
    );
  };

  const disableBtn = useMemo(() => {
    return selected == 'DELIVERY' && !getAddressDisplay();
  }, [addressDelivery, selected]);

  const orderMethods = useMemo(() => {
    return data?.storeReceiveMethod?.map((item: any) => {
      const it = ORDER_METHODS?.find(it => it.id == item);
      return it;
    });
  }, [data]);

  const onUpdateAddress = (address: any) => {
    setAddressDelivery(address);
  };

  const onPressMethod = (method: OrderMethod) => () => {
    setSelected(method);
    onSelectMethod?.(method);
  };

  const onChangeAddress = () => {
    AppNavigator.showDialog({
      screen: InputAddress,
      isFullScreen: true,
      addressRecent: addressOrderRecent,
      onSubmit: onUpdateAddress,
    });
  };

  const handleSubmit = () => {
    onRequestClose?.();
    onSubmit?.({
      shipping: selected,
      address: addressDelivery || addressOrderRecent,
    });
  };

  const selectedLabel = ORDER_METHODS.find(it => it.id === selected)?.label;

  const bottomBtnSubmit = useMemo(() => {
    if (isAndroid()) {
      return insets.bottom < 48 ? -insets.bottom : 0;
    }
    return insets.bottom || 10;
  }, []);

  return (
    <View style={styles.screen}>
      <HeaderDetail
        usePaddingTop={false}
        onPressBack={onRequestClose}
        title={t('order_method.title')}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>{t('order_method.heading')}</Text>
        <Text style={styles.subheading}>{t('order_method.subheading')}</Text>

        <View style={styles.methodRow}>
          {orderMethods?.map(method => {
            const isSelected = selected === method.id;
            return (
              <AppButton
                key={method.id}
                onPress={onPressMethod(method.id)}
                style={[styles.methodCard, isSelected && styles.methodSelected]}
                testID={`order-method-${method.id}`}
              >
                <View style={styles.methodIconBox}>
                  <Image
                    color={ICON_TINT}
                    height={METHOD_ICON_SIZE}
                    name={method.icon}
                    type="svg"
                    width={METHOD_ICON_SIZE}
                  />
                </View>
                <Text style={styles.methodLabel}>{t(method.label)}</Text>
                <Text style={styles.methodDesc}>{t(method.desc)}</Text>
              </AppButton>
            );
          })}
        </View>

        <View style={styles.card}>
          <Text style={styles.storeName}>{data?.storeName}</Text>
          <Text style={styles.storeMeta}>
            {/* {`${data?.storeAddress?.address_name || '-'}  |  ${data?.storeOpeningHours || '-'}`} */}
            {/* TODO: handle show storeOpeningHours */}
            {`${data?.storeAddress?.address_name || '-'}  |  '-'}`}
          </Text>
          <Text style={styles.storeAvailable}>
            {t('order_method.store_available', {
              method: selectedLabel ? t(selectedLabel) : '',
            })}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          {t('order_method.address_section_title')}
        </Text>
        <View style={[styles.card, styles.addressCard]}>
          <Text style={styles.addressText}>{getAddressDisplay()}</Text>
          <AppButton
            onPress={onChangeAddress}
            style={styles.changeBtn}
            testID="order-method-change-address"
          >
            <Text style={styles.changeText}>{t('order_method.change')}</Text>
          </AppButton>
        </View>
      </ScrollView>
      <Button
        title={t('order_method.btn_submit')}
        type="rounded"
        onPress={handleSubmit}
        disabled={disableBtn}
        style={{
          width: '90%',
          alignSelf: 'center',
          bottom: bottomBtnSubmit,
        }}
      />
    </View>
  );
}

export default React.memo(Shipping);

const styles = StyleSheet.create({
  addressCard: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addressText: {
    color: TEXT_DARK,
    flex: 1,
    fontSize: ScaleSize(15),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(16),
    elevation: 3,
    marginTop: ScaleSize(16),
    padding: ScaleSize(18),
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardTitle: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  changeBtn: {
    paddingLeft: ScaleSize(12),
  },
  changeText: {
    color: Colors.primary,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
  content: {
    paddingBottom: ScaleSize(24),
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(20),
  },
  heading: {
    color: TEXT_DARK,
    fontSize: ScaleSize(20),
    fontWeight: '700',
  },
  methodCard: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: 'transparent',
    borderRadius: ScaleSize(16),
    borderWidth: ScaleSize(2),
    elevation: 3,
    flex: 1,
    paddingBottom: ScaleSize(14),
    paddingTop: ScaleSize(12),
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  methodDesc: {
    color: Colors.gray1,
    fontSize: ScaleSize(11),
    marginTop: ScaleSize(3),
    textAlign: 'center',
  },
  methodIconBox: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: Colors.gray3,
    borderRadius: ScaleSize(12),
    height: ScaleSize(88),
    justifyContent: 'center',
    marginHorizontal: ScaleSize(10),
    marginBottom: ScaleSize(12),
  },
  methodLabel: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
  methodRow: {
    flexDirection: 'row',
    gap: ScaleSize(10),
    marginTop: ScaleSize(24),
  },
  methodSelected: {
    borderColor: Colors.primary,
  },
  screen: {
    backgroundColor: SCREEN_BG,
    flex: 1,
    paddingBottom: ScaleSize(10),
  },
  sectionTitle: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '700',
    marginTop: ScaleSize(24),
  },
  storeAvailable: {
    color: Colors.primary,
    fontSize: ScaleSize(14),
    fontWeight: '600',
    marginTop: ScaleSize(10),
  },
  storeMeta: {
    color: Colors.gray1,
    fontSize: ScaleSize(14),
    marginTop: ScaleSize(8),
  },
  storeName: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  subheading: {
    color: Colors.gray1,
    fontSize: ScaleSize(14),
    marginTop: ScaleSize(8),
  },
  waitValue: {
    color: Colors.gray1,
    fontSize: ScaleSize(14),
    marginTop: ScaleSize(10),
  },
});
