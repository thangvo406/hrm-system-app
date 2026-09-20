import type { KeyboardEvent } from 'react-native';

import { Animated, Keyboard, TextInput } from 'react-native';
import { DeviceUtils } from '@kits/core/utils';
import { ScaleSize } from '@kits/core';
import { useCallback, useEffect, useRef } from 'react';

const { isIOS, isIPadOrTablet } = DeviceUtils;
// Breathing room kept between the focused field and the keyboard.
const FOCUS_GAP = ScaleSize(16);
const KEYBOARD_ANIMATION_DURATION_MS = 250;

export const useKeyboardOffset = () => {
  const offset = useRef(new Animated.Value(0)).current;

  const appliedOffset = useRef(0);
  // Y of the keyboard's top edge; 0 while the keyboard is closed.
  const keyboardTop = useRef(0);

  const animateTo = useCallback(
    (value: number, duration?: number) => {
      appliedOffset.current = value;
      Animated.timing(offset, {
        duration: duration || KEYBOARD_ANIMATION_DURATION_MS,
        toValue: value,
        useNativeDriver: true,
      }).start();
    },
    [offset],
  );

  const onFocusField = useCallback(
    (duration?: number) => {
      if (isIPadOrTablet() || keyboardTop.current === 0) {
        return;
      }
      const focused = TextInput.State.currentlyFocusedInput();
      if (!focused) {
        return;
      }
      focused.measureInWindow((_x, y, _width, height) => {
        const hiddenBy = y + height + FOCUS_GAP - keyboardTop.current;
        if (hiddenBy > 0) {
          animateTo(appliedOffset.current - hiddenBy, duration);
        }
      });
    },
    [animateTo],
  );

  useEffect(() => {
    if (isIPadOrTablet()) {
      return;
    }
    const showEvent = isIOS() ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = isIOS() ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (event: KeyboardEvent) => {
      keyboardTop.current = event.endCoordinates.screenY;
      onFocusField(event.duration);
    };

    const onHide = (event: KeyboardEvent) => {
      keyboardTop.current = 0;
      animateTo(0, event.duration);
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [animateTo, onFocusField]);

  return { offset, onFocusField };
};
