import type {
  FastImageProps,
  ImageStyle,
  ResizeMode,
} from '@d11/react-native-fast-image';
import type { SvgProps } from 'react-native-svg';

import icons, { type IconName } from '@assets/icons';
import images, { type ImageName } from '@assets/images';
import FastImage from '@d11/react-native-fast-image';
import React, { useEffect, useState } from 'react';

const DEFAULT_BASE64_MIME_TYPE = 'image/png';
const BASE64_DATA_URI_PATTERN = /^data:image\/[\w+.-]+;base64,/iu;
const WHITESPACE_PATTERN = /\s/gu;

const buildBase64Uri = (base64: string, mimeType: string) =>
  BASE64_DATA_URI_PATTERN.test(base64)
    ? base64
    : `data:${mimeType};base64,${base64.replaceAll(WHITESPACE_PATTERN, '')}`;

type ImageSvgProps = {
  readonly base64?: never;
  readonly height?: number;
  readonly mimeType?: never;
  readonly name: IconName;
  readonly resizeMode?: ResizeMode;
  readonly type: 'svg';
  readonly url?: never;
  readonly width?: number;
  readonly onError?: () => void;
} & SvgProps;

type ImageLocalProps = {
  readonly base64?: never;
  readonly height?: number;
  readonly mimeType?: never;
  readonly name: ImageName;
  readonly resizeMode?: ResizeMode;
  readonly style?: ImageStyle;
  readonly type?: 'image';
  readonly url?: never;
  readonly width?: number;
  readonly onError?: () => void;
} & Omit<FastImageProps, 'resizeMode' | 'source'>;

type ImageUrlProps = {
  readonly base64?: never;
  readonly height?: number | string;
  readonly mimeType?: never;
  readonly name?: never;
  readonly resizeMode?: ResizeMode;
  readonly style?: ImageStyle;
  readonly type?: 'image';
  readonly url?: string;
  readonly width?: number | string;
  readonly onError?: () => void;
} & Omit<FastImageProps, 'resizeMode' | 'source'>;

/**
 * Raw base64 payload (`iVBORw0...`) or a full data URI
 * (`data:image/png;base64,iVBORw0...`).
 */
type ImageBase64Props = {
  readonly base64: string;
  readonly height?: number | string;
  readonly mimeType?: string;
  readonly name?: ImageName;
  readonly resizeMode?: ResizeMode;
  readonly style?: ImageStyle;
  readonly type?: 'image';
  readonly url?: never;
  readonly width?: number | string;
  readonly onError?: () => void;
} & Omit<FastImageProps, 'resizeMode' | 'source'>;

type Properties =
  | ImageBase64Props
  | ImageLocalProps
  | ImageSvgProps
  | ImageUrlProps;

function Image(props: Properties) {
  const {
    base64,
    height,
    mimeType = DEFAULT_BASE64_MIME_TYPE,
    name,
    resizeMode = 'contain',
    style,
    type,
    url,
    width,
    onError,
    ...rest
  } = props || {};
  const remoteUri = base64 ? buildBase64Uri(base64, mimeType) : url;
  const [isFailed, setIsFailed] = useState(false);

  useEffect(() => {
    setIsFailed(false);
  }, [remoteUri]);

  if (type === 'svg') {
    const Icon = icons[name as IconName];
    return <Icon {...(props as SvgProps)} />;
  }

  const imageName = images[name as ImageName];
  const sizeStyle = { height: height ?? 0, width: width ?? 0 } as ImageStyle;

  if (remoteUri && !(isFailed && imageName)) {
    return (
      <FastImage
        {...rest}
        // base64 data URIs are decoded by the RN image view, not the native cache
        fallback={!!base64}
        onError={() => {
          setIsFailed(true);
          onError?.();
        }}
        resizeMode={resizeMode}
        source={{ uri: remoteUri }}
        style={[style, sizeStyle]}
      />
    );
  }

  return (
    <FastImage
      {...rest}
      resizeMode={resizeMode}
      source={imageName}
      style={[style, sizeStyle]}
    />
  );
}

export default React.memo(Image);
