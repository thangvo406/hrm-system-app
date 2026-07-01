import { AppButton, SegmentedTab } from '@components';
import Image from '@components/Image';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

const MOCK_ADDRESS = 'Room 301, 4th Floor, Engineering Building';

const DELIVERY_SECTION_TITLE = 'Delivery/Pickup';
const PICKUP_SECTION_TITLE = 'Select Pickup Time';
const NEW_ADDRESS_LABEL = 'Deliver to a new address';
const TEXT_DARK = '#1A1A1A';
const CARD_BG = '#FFFFFF';
const BORDER_COLOR = Colors.gray2;
const CHEVRON_COLOR = Colors.gray1;
const CHEVRON_SIZE = 14;
const TAB_WIDTH = 180;

type ShippingProperties = {
  readonly onPressPickupTime: () => void;
  readonly onPressSelectAddress: () => void;
  readonly onTabChange: (tab: string) => void;
  readonly pickupTime: string;
  readonly tab: string;
  readonly tabs: any[];
};

type PickupTimeProperties = {
  readonly onPressPickupTime: () => void;
  readonly value: string;
};

function PickupTime({ onPressPickupTime, value }: PickupTimeProperties) {
  return (
    <View style={styles.pickupContainer}>
      <Text style={styles.pickupTitle}>{PICKUP_SECTION_TITLE}</Text>
      <AppButton
        activeOpacity={0.7}
        onPress={onPressPickupTime}
        style={styles.pickupDropdown}
        testID="payment-pickup-time"
      >
        <Text style={styles.pickupValue}>{value?.label}</Text>
        <Image
          color={CHEVRON_COLOR}
          height={CHEVRON_SIZE}
          name="ic_chevron_down"
          type="svg"
          width={CHEVRON_SIZE}
        />
      </AppButton>
    </View>
  );
}

function DeliveryAddress({ onPressSelectAddress }: any) {
  return (
    <>
      <Text style={styles.sectionTitle}>{DELIVERY_SECTION_TITLE}</Text>
      <Text style={styles.addressText}>{MOCK_ADDRESS}</Text>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPressSelectAddress}
        style={styles.newAddressRow}
        testID="payment-new-address"
      >
        <Text style={styles.newAddressText}>{NEW_ADDRESS_LABEL}</Text>
      </TouchableOpacity>
    </>
  );
}

function Shipping({
  onPressPickupTime,
  onTabChange,
  onPressSelectAddress,
  pickupTime,
  tab,
  tabs,
}: ShippingProperties) {
  return (
    <View style={styles.card}>
      <SegmentedTab
        activeTab={tab}
        onTabChange={onTabChange}
        style={styles.segmentedTab}
        tabs={tabs}
      />
      {tab === 'PICKUP' ? (
        <PickupTime onPressPickupTime={onPressPickupTime} value={pickupTime} />
      ) : (
        <DeliveryAddress onPressSelectAddress={onPressSelectAddress} />
      )}
    </View>
  );
}

export default React.memo(Shipping);

const styles = StyleSheet.create({
  addressText: {
    color: Colors.gray1,
    fontSize: ScaleSize(14),
    marginTop: ScaleSize(15),
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: ScaleSize(12),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(16),
  },
  newAddressRow: {
    alignItems: 'flex-end',
    marginTop: ScaleSize(20),
  },
  newAddressText: {
    color: Colors.gray1,
    fontSize: ScaleSize(13),
  },
  pickupContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ScaleSize(8),
  },
  pickupDropdown: {
    alignItems: 'center',
    borderColor: BORDER_COLOR,
    borderRadius: ScaleSize(20),
    borderWidth: 1,
    flexDirection: 'row',
    gap: ScaleSize(8),
    paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(10),
  },
  pickupTitle: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
  pickupValue: {
    color: TEXT_DARK,
    fontSize: ScaleSize(14),
  },
  sectionTitle: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '700',
    marginTop: ScaleSize(20),
  },
  segmentedTab: {
    marginBottom: ScaleSize(14),
    width: ScaleSize(TAB_WIDTH),
  },
});
