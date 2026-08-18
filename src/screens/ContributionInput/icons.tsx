import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

const LEAF_SOFT = '#DFEEDA';
const LEAF_SOFTER = '#EAF4E5';
const BLOB_GREEN = '#EDF5E9';
const DOT_GREEN = '#CBE5C3';

/**
 * Soft leaf shapes + blob painted behind the hero copy — decorative only.
 */
export function LeafBackdrop() {
  return (
    <View pointerEvents="none" style={styles.backdrop}>
      <Svg
        height="100%"
        preserveAspectRatio="xMaxYMin slice"
        viewBox="0 0 375 300"
        width="100%"
      >
        <Ellipse cx="330" cy="150" fill={BLOB_GREEN} rx="190" ry="180" />
        <Path
          d="M262 96 C262 46 296 16 342 12 C346 62 314 94 262 96 Z"
          fill={LEAF_SOFT}
        />
        <Path
          d="M318 132 C318 96 342 74 375 70 C378 106 355 130 318 132 Z"
          fill={LEAF_SOFTER}
        />
        <Circle cx="252" cy="34" fill={DOT_GREEN} r="4" />
        <Circle cx="268" cy="22" fill={DOT_GREEN} r="3" />
        <Circle cx="252" cy="52" fill={DOT_GREEN} r="3" />
        <Circle cx="268" cy="44" fill={DOT_GREEN} r="4" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
});
