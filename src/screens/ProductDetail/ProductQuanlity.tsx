import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PRIMARY_COLOR = '#5BB85C';
const PRIMARY_DISABLED_COLOR = '#DCEEDD';
const TEXT_COLOR = '#1A1A1A';
const ICON_COLOR = '#FFFFFF';

const BUTTON_SIZE = ScaleSize(32);
const BAR_WIDTH = ScaleSize(16);
const BAR_THICKNESS = ScaleSize(2.5);

type ProductQuantityProps = {
  readonly onChange: (delta: number) => void;
  readonly quantity: number;
  readonly minChooseQuantity: number;
};

function ProductQuantity({
  onChange,
  minChooseQuantity,
  quantity,
}: ProductQuantityProps) {
  const canDecrease = quantity > minChooseQuantity;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={!canDecrease}
        onPress={() => onChange(-1)}
        style={[
          styles.button,
          {
            backgroundColor: canDecrease
              ? PRIMARY_COLOR
              : PRIMARY_DISABLED_COLOR,
          },
        ]}
        testID="product-quantity-decrease"
      >
        <View style={styles.minus} />
      </TouchableOpacity>

      <Text style={styles.value} testID="product-quantity-value">
        {quantity}
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onChange(1)}
        style={[styles.button, { backgroundColor: PRIMARY_COLOR }]}
        testID="product-quantity-increase"
      >
        <View style={styles.minus} />
        <View style={[styles.minus, styles.vertical]} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: BUTTON_SIZE / 2,
    height: BUTTON_SIZE,
    justifyContent: 'center',
    width: BUTTON_SIZE,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(28),
    justifyContent: 'center',
  },
  minus: {
    backgroundColor: ICON_COLOR,
    borderRadius: BAR_THICKNESS / 2,
    height: BAR_THICKNESS,
    width: BAR_WIDTH,
  },
  value: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(18),
    fontWeight: '700',
    minWidth: ScaleSize(24),
    textAlign: 'center',
  },
  vertical: {
    position: 'absolute',
    transform: [{ rotate: '90deg' }],
  },
});

export default ProductQuantity;
