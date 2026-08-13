import type { OrderMethodItem } from '@hooks/useOrderShipping';

import { AppButton, Button, HeaderDetail, Image } from '@components';
import { Colors } from '@constants';
import { useOrderShipping } from '@hooks';
import { ScaleSize } from '@kits/core';
import { DeviceUtils } from '@kits/core/utils';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const SCREEN_BG = '#F2F2F2';
const TEXT_DARK = '#1A1A1A';
const ICON_TINT = '#6B6B6B';
const METHOD_ICON_SIZE = ScaleSize(34);
const { ifAndroid } = DeviceUtils;

function OrderShipping(props: any) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    addressDisplay,
    data,
    disableBtn,
    onChangeAddress,
    onPressMethod,
    onSubmit,
    orderMethods,
    selected,
    selectedLabel,
  } = useOrderShipping(props);

  return (
    <View style={styles.screen}>
      <HeaderDetail hideNotify title={t('order_method.title')} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>{t('order_method.heading')}</Text>
        <Text style={styles.subheading}>{t('order_method.subheading')}</Text>

        <View style={styles.methodRow}>
          {orderMethods?.map((method: OrderMethodItem) => {
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
            {`${data?.storeAddress?.address_name || '-'}  | -`}
          </Text>
          <Text style={styles.storeAvailable}>
            {t('order_method.store_available', {
              method: selectedLabel ? t(selectedLabel) : '',
            })}
          </Text>
        </View>

        {selected == 'DELIVERY' && (
          <>
            <Text style={styles.sectionTitle}>
              {t('order_method.address_section_title')}
            </Text>
            <View style={[styles.card, styles.addressCard]}>
              <Text style={styles.addressText}>{addressDisplay || '--'}</Text>
              <AppButton
                onPress={onChangeAddress}
                style={styles.changeBtn}
                testID="order-method-change-address"
              >
                <Text style={styles.changeText}>
                  {t('order_method.change')}
                </Text>
              </AppButton>
            </View>
            <Text style={styles.addressNote}>
              {t('order_method.address_delivery_note')}
            </Text>
          </>
        )}
      </ScrollView>
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: ifAndroid(16, insets.bottom || ScaleSize(20)) },
        ]}
      >
        <Button
          disabled={disableBtn}
          onPress={onSubmit}
          testID="order-method-submit"
          title={t('order_method.btn_submit')}
          type="rounded"
        />
      </View>
    </View>
  );
}

export default OrderShipping;

const styles = StyleSheet.create({
  addressCard: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addressNote: {
    color: Colors.green04,
    fontSize: ScaleSize(14),
    marginTop: ScaleSize(16),
  },
  addressText: {
    color: TEXT_DARK,
    flex: 1,
    fontSize: ScaleSize(15),
  },
  bottomBar: {
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(12),
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
    marginBottom: ScaleSize(12),
    marginHorizontal: ScaleSize(10),
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
});
