import type { IOrderHistoryDetailItem } from '@type';

import { Colors } from '@constants';
import { Image } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import React from 'react';
import imageNames from '@assets/images/names';

import SectionCard from './SectionCard';
import { EMPTY_VALUE, sharedStyles } from './theme';
import { formatPhoneNumber } from '@utils/common';

type Properties = {
  readonly order?: IOrderHistoryDetailItem;
};

const PHONE_ICON_SIZE = ScaleSize(16);
const DELIVERY_METHOD = 'delivery';

function DeliveryInfoSection({ order = undefined }: Properties) {
  const { t } = useTranslation();
  const receiveMethod = order?.orderReceiveMethod?.toLowerCase();
  const address =
    receiveMethod === DELIVERY_METHOD
      ? order?.address?.address_name
      : order?.storeAddress?.address?.address_name;

  return (
    <SectionCard
      iconName="ic_map_pin"
      title={t('order_history_detail.delivery_section_title')}
    >
      <View style={styles.recipientRow}>
        <View>
          <Text style={sharedStyles.label}>
            {t('order_history_detail.recipient_label')}
          </Text>
          <Text style={styles.recipientName}>
            {order?.userName || EMPTY_VALUE}
          </Text>
        </View>
        <View style={styles.phoneRow}>
          <Image
            height={PHONE_ICON_SIZE}
            name={imageNames.ic_phone}
            width={PHONE_ICON_SIZE}
          />
          <Text style={styles.phoneText}>
            {formatPhoneNumber(order?.userPhone)}
          </Text>
        </View>
      </View>

      <View style={sharedStyles.divider} />
      <View style={styles.fieldBlock}>
        <Text style={sharedStyles.label}>
          {t('order_history_detail.delivery_address_label')}
        </Text>
        <Text style={styles.fieldValue}>{address || EMPTY_VALUE}</Text>
      </View>

      <View style={sharedStyles.divider} />
      <View style={styles.fieldBlock}>
        <Text style={sharedStyles.label}>
          {t('order_history_detail.shipping_method_label')}
        </Text>
        <Text style={styles.fieldValue}>
          {t(`order_history_detail.shipping_methods.${receiveMethod}`)}
        </Text>
      </View>
    </SectionCard>
  );
}

export default React.memo(DeliveryInfoSection);

const styles = StyleSheet.create({
  fieldBlock: {
    paddingVertical: ScaleSize(10),
  },
  fieldValue: {
    color: Colors.black01,
    fontSize: ScaleSize(14),
    fontWeight: '500',
    marginTop: ScaleSize(4),
  },
  phoneRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(4),
  },
  phoneText: {
    color: Colors.black01,
    fontSize: ScaleSize(14),
    fontWeight: '500',
  },
  recipientName: {
    color: Colors.black01,
    fontSize: ScaleSize(15),
    fontWeight: '600',
    marginTop: ScaleSize(2),
  },
  recipientRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: ScaleSize(10),
  },
});
