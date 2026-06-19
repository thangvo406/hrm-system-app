import type { DialogScreenHandle } from '@screens/Dialog/types';

import { Image } from '@components';
import { ScaleSize } from '@kits/core';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import React from 'react';

const CLOSE_BUTTON_SIZE = ScaleSize(36);
const CLOSE_ICON_SIZE = ScaleSize(20);
const CLOSE_BUTTON_TOP = ScaleSize(48);
const CLOSE_BUTTON_RIGHT = ScaleSize(16);

const BACKDROP_COLOR = 'rgba(0, 0, 0, 0.5)';

type Properties = {
  readonly imageUrl: string;
  readonly onRequestClose: DialogScreenHandle['onRequestClose'];
};

function ImagePreview({ imageUrl, onRequestClose }: Properties) {
  return (
    <View style={styles.container} testID="image-preview">
      <TouchableOpacity
        onPress={onRequestClose}
        style={styles.backdrop}
        testID="image-preview-backdrop"
      >
        <View style={styles.imageWrap}>
          <Image
            height="100%"
            resizeMode="contain"
            style={styles.image}
            testID="image-preview-image"
            url={imageUrl}
            width="100%"
          />
        </View>
        <TouchableOpacity
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
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}

export default React.memo(ImagePreview);

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: BACKDROP_COLOR,
    flex: 1,
    justifyContent: 'center',
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
  imageWrap: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: ScaleSize(12),
    width: '100%',
  },
});
