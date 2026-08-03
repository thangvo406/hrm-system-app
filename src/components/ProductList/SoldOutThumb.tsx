import imageNames from '@assets/images/names';
import { ProgressiveImage } from '@components';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Defs,
  FeColorMatrix,
  Filter,
  Image as SvgImage,
} from 'react-native-svg';

type Properties = {
  readonly size: number;
  readonly uri?: string;
};

function SoldOutThumb({ size, uri }: Properties) {
  return (
    <View style={{ height: size, width: size }}>
      <ProgressiveImage
        height={size}
        name={imageNames.img_product_default}
        resizeMode="cover"
        url={uri ?? ''}
        width={size}
      />
      {uri ? (
        <Svg height={size} style={StyleSheet.absoluteFill} width={size}>
          <Defs>
            <Filter id="soldOutGrayscale">
              <FeColorMatrix type="saturate" values="0" />
            </Filter>
          </Defs>
          <SvgImage
            filter="url(#soldOutGrayscale)"
            height={size}
            href={{ uri }}
            preserveAspectRatio="xMidYMid slice"
            width={size}
          />
        </Svg>
      ) : undefined}
    </View>
  );
}

export default React.memo(SoldOutThumb);
