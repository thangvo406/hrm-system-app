import { ScaleSize } from '@kits/core';
import { NOOP } from '@utils/common';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
type AddressCardProps = {
  readonly landAddress?: string;
  readonly onPress?: () => void;
  readonly postalCode?: string;
  readonly roadAddress?: string;
  readonly selected?: boolean;
  readonly town?: string;
};

function AddressCard({
  landAddress = '',
  onPress = NOOP,
  postalCode = '',
  roadAddress = '',
  selected = false,
  town = '',
}: AddressCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.container, selected && styles.selectedContainer]}
      testID="address-card"
    >
      {selected ? (
        <View style={styles.check}>
          <Text style={styles.checkText}>✓</Text>
        </View>
      ) : undefined}

      {!!roadAddress && (
        <>
          <View style={styles.badgeBlue}>
            <Text style={styles.badgeBlueText}>도로명</Text>
          </View>
          <Text style={styles.address}>{roadAddress}</Text>
          {(!!postalCode || !!town) && (
            <View style={styles.metaRow}>
              {!!postalCode && (
                <>
                  <Text style={styles.metaLabel}>우편번호</Text>
                  <Text style={styles.metaValue}>{postalCode}</Text>
                </>
              )}
              {!!postalCode && !!town && (
                <Text style={styles.separator}>|</Text>
              )}
              {!!town && <Text style={styles.metaValue}>{town}</Text>}
            </View>
          )}
        </>
      )}

      {!!landAddress && (
        <>
          {!!roadAddress && <View style={styles.divider} />}
          <View style={styles.badgeGreen}>
            <Text style={styles.badgeGreenText}>지번</Text>
          </View>
          <Text style={styles.landAddress}>{landAddress}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  address: {
    color: '#111827',
    fontSize: ScaleSize(16),
    fontWeight: '600',
    lineHeight: ScaleSize(24),
    marginTop: ScaleSize(8),
  },
  badgeBlue: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAF2FF',
    borderRadius: ScaleSize(6),
    paddingHorizontal: ScaleSize(8),
    paddingVertical: ScaleSize(3),
  },
  badgeBlueText: {
    color: '#2563EB',
    fontSize: ScaleSize(11),
    fontWeight: '600',
  },
  badgeGreen: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF3',
    borderRadius: ScaleSize(6),
    paddingHorizontal: ScaleSize(8),
    paddingVertical: ScaleSize(3),
  },
  badgeGreenText: {
    color: '#16A34A',
    fontSize: ScaleSize(11),
    fontWeight: '600',
  },
  check: {
    alignItems: 'center',
    backgroundColor: '#22C55E',
    borderRadius: ScaleSize(13),
    height: ScaleSize(26),
    justifyContent: 'center',
    position: 'absolute',
    right: ScaleSize(14),
    top: ScaleSize(14),
    width: ScaleSize(26),
  },
  checkText: {
    color: '#FFF',
    fontSize: ScaleSize(13),
    fontWeight: '700',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: ScaleSize(12),
    borderWidth: 1,
    marginBottom: ScaleSize(8),
    marginHorizontal: ScaleSize(16),
    padding: ScaleSize(16),
  },
  divider: {
    backgroundColor: '#F3F4F6',
    height: 1,
    marginVertical: ScaleSize(12),
  },
  landAddress: {
    color: '#374151',
    fontSize: ScaleSize(14),
    lineHeight: ScaleSize(20),
    marginTop: ScaleSize(6),
  },
  metaLabel: {
    color: '#6B7280',
    fontSize: ScaleSize(12),
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: ScaleSize(8),
  },
  metaValue: {
    color: '#374151',
    fontSize: ScaleSize(12),
    fontWeight: '500',
    marginLeft: ScaleSize(4),
  },
  selectedContainer: {
    borderColor: '#22C55E',
    borderWidth: 2,
  },
  separator: {
    color: '#9CA3AF',
    marginHorizontal: ScaleSize(8),
  },
});

export default React.memo(AddressCard);
