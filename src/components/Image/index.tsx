import type {
  FastImageProps,
  ImageStyle,
  ResizeMode,
} from '@d11/react-native-fast-image';
import type { SvgProps } from 'react-native-svg';

import icons, { type IconName } from '@assets/icons';
import images, { type ImageName } from '@assets/images';
import FastImage from '@d11/react-native-fast-image';
import React, { useState } from 'react';

type ImageSvgProps = {
  readonly height?: number;
  readonly name: IconName;
  readonly resizeMode?: ResizeMode;
  readonly type: 'svg';
  readonly url?: never;
  readonly width?: number;
  readonly onError?: () => void;
} & SvgProps;

type ImageLocalProps = {
  readonly height?: number;
  readonly name: ImageName;
  readonly resizeMode?: ResizeMode;
  readonly style?: ImageStyle;
  readonly type?: 'image';
  readonly url?: never;
  readonly width?: number;
  readonly onError?: () => void;
} & Omit<FastImageProps, 'resizeMode' | 'source'>;

type ImageUrlProps = {
  readonly height?: number | string;
  readonly name?: never;
  readonly resizeMode?: ResizeMode;
  readonly style?: ImageStyle;
  readonly type?: 'image';
  readonly url?: string;
  readonly width?: number | string;
  readonly onError?: () => void;
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
    onError,
    ...rest
  } = props || {};
  const [urlPathImage, setUrlPathImage] = useState(url);
  if (type === 'svg') {
    const Icon = icons[name as IconName];
    return <Icon {...(props as SvgProps)} />;
  }

  const imageName = images[name as ImageName];

  if (urlPathImage) {
    return (
      <FastImage
        {...rest}
        onError={() => {
          if (imageName) {
            setUrlPathImage('');
          }
          onError?.();
        }}
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
      source={imageName}
      style={[style, { height: height ?? 0, width: width ?? 0 }]}
    />
  );
}

export default React.memo(Image);
