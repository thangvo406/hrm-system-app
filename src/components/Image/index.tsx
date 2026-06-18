import type {
  FastImageProps,
  ImageStyle,
  ResizeMode,
} from '@d11/react-native-fast-image';
import type { SvgProps } from 'react-native-svg';

import icons, { type IconName } from '@assets/icons';
import images, { type ImageName } from '@assets/images';
import FastImage from '@d11/react-native-fast-image';
import React from 'react';

type ImageSvgProps = {
  readonly height?: number;
  readonly name: IconName;
  readonly resizeMode?: ResizeMode;
  readonly type: 'svg';
  readonly url?: never;
  readonly width?: number;
} & SvgProps;

type ImageLocalProps = {
  readonly height?: number;
  readonly name: ImageName;
  readonly resizeMode?: ResizeMode;
  readonly style?: ImageStyle;
  readonly type?: 'image';
  readonly url?: never;
  readonly width?: number;
} & Omit<FastImageProps, 'resizeMode' | 'source'>;

type ImageUrlProps = {
  readonly height?: number;
  readonly name?: never;
  readonly resizeMode?: ResizeMode;
  readonly style?: ImageStyle;
  readonly type?: 'image';
  readonly url: string;
  readonly width?: number;
} & Omit<FastImageProps, 'resizeMode' | 'source'>;

type Properties = ImageSvgProps | ImageLocalProps | ImageUrlProps;

function Image(props: Properties) {
  const {
    height,
    name,
    resizeMode = 'contain',
    style,
    type,
    url,
    width,
    ...rest
  } = props || {};
  if (type === 'svg') {
    const Icon = icons[name as IconName];
    return <Icon {...(props as SvgProps)} />;
  }

  if (url) {
    return (
      <FastImage
        {...rest}
        resizeMode={resizeMode}
        source={{ uri: url }}
        style={[style, { height: height ?? 0, width: width ?? 0 }]}
      />
    );
  }

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
