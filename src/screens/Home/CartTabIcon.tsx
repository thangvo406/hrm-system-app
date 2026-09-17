import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from '@components';

type Properties = {
  readonly color: string;
  readonly size: number;
};

// Badge số lượng giỏ hàng đã gỡ cùng nghiệp vụ coop; icon giữ nguyên để layout
// bottom tab không đổi khi dựng lại nghiệp vụ HRM.
function CartTabIcon({ color, size }: Properties) {
  return (
    <View style={styles.container}>
      <Image
        color={color}
        height={size}
        name="ic_cart"
        type="svg"
        width={size}
      />
    </View>
  );
}

export default React.memo(CartTabIcon);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
