import type { StyleProp, ViewStyle } from 'react-native';

// Imported from the source file, not the `@hooks` barrel: that barrel pulls in
// hooks which import `@components`, and this component lives in that barrel.
import { useKeyboardOffset } from '@hooks/useKeyboardOffset';
import React, { useCallback } from 'react';
import { Animated, StyleSheet } from 'react-native';

type RenderChildren = (helpers: {
  readonly onFocusField: () => void;
}) => React.ReactNode;

type Properties = {
  readonly children: RenderChildren | React.ReactNode;
  readonly style?: StyleProp<ViewStyle>;
};

function KeyboardAvoidingView({ children, style }: Properties) {
  const { offset, onFocusField } = useKeyboardOffset();

  const handleFocusField = useCallback(() => {
    onFocusField();
  }, [onFocusField]);

  return (
    <Animated.View
      style={[styles.container, style, { transform: [{ translateY: offset }] }]}
    >
      {typeof children === 'function'
        ? (children as RenderChildren)({ onFocusField: handleFocusField })
        : children}
    </Animated.View>
  );
}

export default React.memo(KeyboardAvoidingView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
