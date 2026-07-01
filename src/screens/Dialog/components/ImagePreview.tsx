import type { DialogScreenHandle } from '@screens/Dialog/types';

import { Image } from '@components';
import AppButton from '@components/AppButton';
import { ScaleSize } from '@kits/core';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import React from 'react';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const CLOSE_BUTTON_SIZE = ScaleSize(36);
const CLOSE_ICON_SIZE = ScaleSize(20);
const CLOSE_BUTTON_TOP = ScaleSize(48);
const CLOSE_BUTTON_RIGHT = ScaleSize(16);
const OVERLAY_DURATION = 220;

type Properties = {
  readonly imageUrl: string;
  readonly onRequestClose: DialogScreenHandle['onRequestClose'];
};

function ImagePreview({ imageUrl, onRequestClose }: Properties) {
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(overlayOpacity, {
      toValue: 1,
      duration: OVERLAY_DURATION,
      useNativeDriver: true,
    }).start();
  }, [overlayOpacity]);

  return (
    <View style={styles.container} testID="image-preview">
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      <AppButton
        activeOpacity={1}
        onPress={onRequestClose}
        style={styles.backdrop}
        testID="image-preview-backdrop"
      >
        <Image
          height="100%"
          resizeMode="contain"
          style={styles.image}
          testID="image-preview-image"
          url={imageUrl}
          width="100%"
        />
      </AppButton>
      <AppButton
        hitSlop={ScaleSize(10)}
        onPress={onRequestClose}
        style={styles.closeButton}
        testID="image-preview-close"
      >
        <Image
          color="#FFFFFF"
          height={CLOSE_ICON_SIZE}
          name="x-circle"
          type="svg"
          width={CLOSE_ICON_SIZE}
        />
      </AppButton>
    </View>
  );
}

export default React.memo(ImagePreview);

const styles = StyleSheet.create({
  backdrop: {
    height: SCREEN_H,
    width: SCREEN_W,
  },
  closeButton: {
    alignItems: 'center',
    height: CLOSE_BUTTON_SIZE,
    justifyContent: 'center',
    position: 'absolute',
    right: CLOSE_BUTTON_RIGHT,
    top: CLOSE_BUTTON_TOP,
    width: CLOSE_BUTTON_SIZE,
  },
  container: {
    flex: 1,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
