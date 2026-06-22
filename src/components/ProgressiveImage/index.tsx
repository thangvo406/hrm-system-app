import type { ImageStyle, ResizeMode } from '@d11/react-native-fast-image';
import type { StyleProp, ViewStyle } from 'react-native';

import { Image } from '@components';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';

const DEFAULT_BONE_COLOR = '#E5E5E5';
const DEFAULT_DURATION = 1000;
const DEFAULT_HIGHLIGHT_COLOR = '#F2F2F2';

type Properties = {
  readonly containerStyle?: StyleProp<ViewStyle>;
  readonly height: number;
  readonly imageStyle?: ImageStyle;
  readonly resizeMode?: ResizeMode;
  readonly skeletonBoneColor?: string;
  readonly skeletonDuration?: number;
  readonly skeletonHighlightColor?: string;
  readonly url: string;
  readonly width: number;
  readonly name?: string;
};

function ProgressiveImage({
  containerStyle = undefined,
  height,
  imageStyle = undefined,
  resizeMode = 'cover',
  skeletonBoneColor = DEFAULT_BONE_COLOR,
  skeletonDuration = DEFAULT_DURATION,
  skeletonHighlightColor = DEFAULT_HIGHLIGHT_COLOR,
  url,
  width,
  name = '',
}: Properties) {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <View style={[styles.container, { height, width }, containerStyle]}>
      <Image
        height={height}
        onError={handleError}
        onLoad={handleLoad}
        resizeMode={resizeMode}
        style={[styles.image, imageStyle]}
        url={url}
        name={name}
        width={width}
      />
      {isLoading ? (
        <Skeleton
          animationType="shiver"
          boneColor={skeletonBoneColor}
          containerStyle={StyleSheet.absoluteFill}
          duration={skeletonDuration}
          highlightColor={skeletonHighlightColor}
          isLoading
          layout={[
            {
              height: '100%',
              key: 'progressive-image-bone',
              width: '100%',
            },
          ]}
        />
      ) : undefined}
    </View>
  );
}

export default React.memo(ProgressiveImage);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    height: '100%',
    width: '100%',
  },
});
