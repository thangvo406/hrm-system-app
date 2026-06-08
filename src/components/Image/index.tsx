import type { FastImageProps, ImageStyle } from '@d11/react-native-fast-image';
import type { SvgProps } from 'react-native-svg';

import icons, { type IconName } from '@assets/icons';
import images, { type ImageName } from '@assets/images';
import FastImage from '@d11/react-native-fast-image';
import React from 'react';

type ImageProps = {
  readonly height?: number;
  readonly name: ImageName;
  readonly style?: ImageStyle;
  readonly type?: 'image';
  readonly width?: number;
} & Omit<FastImageProps, 'source'>;

type Properties =
  | ({
      readonly height?: number;
      readonly name: IconName;
      readonly type: 'svg';
      readonly width?: number;
    } & SvgProps)
  | ImageProps;

function Image({ name, type, ...props }: Properties) {
  if (type === 'svg') {
    const Icon = icons[name as IconName];
    return <Icon {...(props as SvgProps)} />;
  }

  const { height, resizeMode = 'contain', style, width, ...rest } = props as {
    height?: number;
    style?: ImageStyle;
    width?: number;
  } & Omit<FastImageProps, 'source'>;

  return (
    <FastImage
      {...rest}
      resizeMode={resizeMode}
      source={images[name as ImageName]}
      style={[style, { height: height ?? 0, width: width ?? 0 }]}
    />
  );
}

export default React.memo(Image);
