import Image from '@components/Image';
import { ScaleSize } from '@kits/core';
import { StyleSheet, View } from 'react-native';
import React from 'react';

const BANNER_HEIGHT = ScaleSize(30);
const BANNER_WIDTH = ScaleSize(68);

function RegisterHeader() {
  return (
    <View style={styles.header}>
      <Image
        height={BANNER_HEIGHT}
        name="ic_logo_banner"
        width={BANNER_WIDTH}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingBottom: ScaleSize(10),
    paddingTop: ScaleSize(16),
    position: 'relative',
  },
});

export default React.memo(RegisterHeader);
