import { Colors } from '@constants';
import Image from '../Image';
import { ScaleSize } from '@kits/core';
import { DeviceUtils } from '@kits/core/utils';
import React, { useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';

const { ifAndroid, ifIPadOrTablet } = DeviceUtils;
function EmptyView(props: any) {
  const { icon, type, desc2, iconColor, style, renderDesc, desc } = props || {};

  const sizeImage = useMemo(() => {
    return ScaleSize(96);
  }, [type]);

  return (
    <View style={[styles.container, style]}>
      <Image
        type={type}
        name={icon}
        width={sizeImage}
        height={sizeImage}
        color={iconColor}
        style={{
          width: sizeImage,
          height: sizeImage,
          marginBottom: ifIPadOrTablet(20, 0),
        }}
      />
      {renderDesc ? (
        renderDesc()
      ) : (
        <>
          <Text
            style={{
              fontSize: ScaleSize(16),
              color: Colors.gray1,
              textAlign: 'center',
              marginTop: ScaleSize(10),
              width: ScaleSize(300, 350),
              fontWeight: ifAndroid('bold', undefined),
              // borderWidth:1,
            }}
          >
            {desc}
          </Text>
          {desc2 ? (
            <Text
              style={{
                marginTop: ScaleSize(10),
                fontSize: ScaleSize(16),
                color: Colors.gray1,
                textAlign: 'center',
                width: ScaleSize(300),
              }}
            >
              {desc2}
            </Text>
          ) : undefined}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default React.memo(EmptyView);
