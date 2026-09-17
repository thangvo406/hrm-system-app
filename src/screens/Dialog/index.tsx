import type { DialogHandle, DialogItem } from './types';

import BottomSheetOverlay from './BottomSheetOverlay';
import DialogOverlay from './DialogOverlay';
import { DIALOG_Z_INDEX } from './constants';
import Loading from './components/Loading';
import { useDialogManager } from './Manager';
import SnackbarOverlay from './SnackbarOverlay';
import ToastOverlay from './ToastOverlay';
import { BackHandler, StyleSheet, View } from 'react-native';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

function computeZIndex(index: number): number {
  return DIALOG_Z_INDEX.base + index * DIALOG_Z_INDEX.step;
}

/**
 * Hosts the dialog/toast/loading stack. Mounts a transparent absolute layer
 * at the App root and renders every active overlay on top of the navigator.
 *
 * Multiple overlays can be live at the same time — each gets a strictly
 * increasing zIndex so the newest one stays on top.
 *
 * Loading is implemented as a special non-cancelable dialog backed by the
 * `Loading` screen component. The host keeps a ref to its id so subsequent
 * `showLoading()` calls are idempotent and `hideLoading()` always closes
 * the right instance.
 */
const Dialog = forwardRef<DialogHandle>((_props, reference) => {
  const manager = useDialogManager();
  // const willShowReference = useRef(false);
  const loadingIdReference = useRef<string | undefined>(undefined);

  // Guard show*() so that callers must opt in via setWillShow(true) first.
  // This matches the pre-existing AppNavigator contract — setWillShow is
  // always called before any showDialog/showToast/showLoading invocation.
  const guardedShowDialog = useCallback(
    (options: Parameters<DialogHandle['showDialog']>[0]): string => {
      return manager.showDialog(options);
    },
    [manager],
  );

  const guardedShowToast = useCallback(
    (options: Parameters<DialogHandle['showToast']>[0]): string => {
      return manager.showToast(options);
    },
    [manager],
  );

  const guardedShowSnackBar = useCallback(
    (options: Parameters<DialogHandle['showSnackBar']>[0]): string => {
      // alert(willShowReference.current);
      // if (!willShowReference.current) {
      //   return '';
      // }
      return manager.showSnackBar(options);
    },
    [manager],
  );

  const showLoading = useCallback(
    (options?: Parameters<DialogHandle['showLoading']>[0]): string => {
      // The `options` bag is reserved for future Loading screen props
      // (e.g. a message); the current screen is prop-free, so the value
      // is intentionally read-only here.
      void options;
      // if (!willShowReference.current) {
      //   return '';
      // }
      if (loadingIdReference.current !== undefined) {
        return loadingIdReference.current;
      }
      const id = manager.showDialog({
        cancelable: false,
        isFullScreen: false,
        screen: Loading,
        transparent: true,
      });
      loadingIdReference.current = id;
      return id;
    },
    [manager],
  );

  const hideLoading = useCallback((): void => {
    if (loadingIdReference.current === undefined) {
      return;
    }
    const id = loadingIdReference.current;
    loadingIdReference.current = undefined;
    manager.closeDialog(id);
  }, [manager]);

  const imperativeHandle = useMemo<DialogHandle>(
    () => ({
      closeAll: () => {
        loadingIdReference.current = undefined;
        manager.closeAll();
      },
      closeBottomSheet: manager.closeBottomSheet,
      closeDialog: manager.closeDialog,
      hideLoading,
      // setWillShow: (willShow: boolean) => {
      //   willShowReference.current = willShow;
      // },
      showBottomSheet: manager.showBottomSheet,
      showDialog: guardedShowDialog,
      showLoading,
      showSnackBar: guardedShowSnackBar,
      showToast: guardedShowToast,
    }),
    [
      guardedShowDialog,
      guardedShowSnackBar,
      guardedShowToast,
      hideLoading,
      manager.closeAll,
      manager.closeBottomSheet,
      manager.closeDialog,
      manager.showBottomSheet,
      showLoading,
    ],
  );

  useImperativeHandle(reference, () => imperativeHandle, [imperativeHandle]);

  // Android hardware back: close the topmost cancelable overlay, if any.
  // Loading is non-cancelable so back-button cannot dismiss it.
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        for (let cursor = manager.items.length - 1; cursor >= 0; cursor--) {
          const item = manager.items[cursor] as DialogItem | undefined;
          if (
            item?.type === 'bottomSheet' &&
            item.options.cancelable !== false
          ) {
            manager.closeBottomSheet(item.id);
            return true;
          }
          if (item?.type === 'dialog' && item.options.cancelable !== false) {
            manager.closeDialog(item.id);
            return true;
          }
        }
        return false;
      },
    );
    return () => {
      subscription.remove();
    };
  }, [manager.closeBottomSheet, manager.closeDialog, manager.items]);

  if (manager.items.length === 0) {
    return undefined;
  }

  return (
    <View pointerEvents="box-none" style={styles.host} testID="dialog-host">
      {manager.items.map((item, index) => {
        const zIndex = computeZIndex(index);
        if (item.type === 'bottomSheet') {
          return (
            <BottomSheetOverlay
              cancelable={item.options.cancelable !== false}
              draggable={item.options.draggable !== false}
              key={item.id}
              onDismiss={() => {
                item.options.onDismiss?.();
                manager.closeBottomSheet(item.id);
              }}
              options={item.options}
              zIndex={zIndex}
            />
          );
        }
        if (item.type === 'dialog') {
          return (
            <DialogOverlay
              cancelable={item.options.cancelable !== false}
              isFullScreen={item.options.isFullScreen === true}
              key={item.id}
              onDismiss={() => {
                item.options.onDismiss?.();
                manager.closeDialog(item.id);
              }}
              options={item.options}
              transparent={item.options.transparent === true}
              zIndex={zIndex}
            />
          );
        }
        if (item.type === 'snackbar') {
          return (
            <SnackbarOverlay
              key={item.id}
              onDismiss={() => {
                manager.closeDialog(item.id);
              }}
              options={item.options}
              zIndex={zIndex}
            />
          );
        }
        return (
          <ToastOverlay
            key={item.id}
            onDismiss={() => {
              manager.closeDialog(item.id);
            }}
            options={item.options}
            zIndex={zIndex}
          />
        );
      })}
    </View>
  );
});

Dialog.displayName = 'Dialog';

const styles = StyleSheet.create({
  host: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Dialog;
