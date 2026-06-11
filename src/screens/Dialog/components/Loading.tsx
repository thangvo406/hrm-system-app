import { ScaleSize } from '@kits/core';
import { SkypeIndicator } from 'react-native-indicators';
import { StyleSheet, View } from 'react-native';

const SPINNER_SIZE = ScaleSize(32);
const SPINNER_COLOR = '#5BB85C';
const MIN_WIDTH = ScaleSize(140);
const SPINNER_ANIMATION_DURATION = 900;
const SPINNER_TRACK_WIDTH = ScaleSize(3);
const CONTAINER_GAP = ScaleSize(14);
const CONTAINER_PADDING_HORIZONTAL = ScaleSize(28);
const CONTAINER_PADDING_VERTICAL = ScaleSize(24);
const MESSAGE_FONT_SIZE = ScaleSize(14);
const NOOP = (): void => undefined;

type LoadingProps = {
  readonly onRequestClose?: () => void;
};

/**
 * Screen component used by the Dialog host's `showLoading()` API. Renders a
 * centered SkypeIndicator (from `react-native-indicators`) on top of the
 * underlying screen. The dialog host wires it as a non-cancelable,
 * transparent-card dialog so user gestures can't dismiss it and the screen
 * stays visible behind it — only the matching `hideLoading()` call can
 * close it.
 */
function Loading({ onRequestClose = NOOP }: LoadingProps) {
  // `onRequestClose` is injected by the dialog host. Loading intentionally
  // ignores it — the host controls the lifecycle via the loadingId reference.
  void onRequestClose;
  return (
    <View style={styles.container} testID="loading-screen">
      <SkypeIndicator
        animationDuration={SPINNER_ANIMATION_DURATION}
        color={SPINNER_COLOR}
        size={SPINNER_SIZE}
        trackWidth={SPINNER_TRACK_WIDTH}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'column',
    gap: CONTAINER_GAP,
    justifyContent: 'center',
    minWidth: MIN_WIDTH,
    paddingHorizontal: CONTAINER_PADDING_HORIZONTAL,
    paddingVertical: CONTAINER_PADDING_VERTICAL,
  },
  message: {
    color: '#1A1A1A',
    fontSize: MESSAGE_FONT_SIZE,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Loading;
