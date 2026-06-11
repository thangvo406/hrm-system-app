import type {
  DialogItem,
  DialogOptions,
  SnackbarOptions,
  ToastOptions,
} from './types';

import { useCallback, useState } from 'react';

let counter = 0;
const nextId = (prefix: 'dialog' | 'toast' | 'snackbar'): string => {
  counter += 1;
  return `${prefix}_${Date.now()}_${counter}`;
};

export type DialogManager = {
  readonly closeAll: () => void;
  readonly closeDialog: (id?: string) => void;
  readonly items: readonly DialogItem[];
  readonly showDialog: (options: DialogOptions) => string;
  readonly showSnackBar: (options: SnackbarOptions) => string;
  readonly showToast: (options: ToastOptions) => string;
};

/**
 * Holds the dialog/toast/snackbar queue and exposes imperative mutators.
 * The returned `items` array drives the overlays rendered by the host component.
 * Multiple dialogs, toasts and snackbars can live in the queue at the same time.
 */
export function useDialogManager(): DialogManager {
  const [items, setItems] = useState<readonly DialogItem[]>([]);

  const showDialog = useCallback((options: DialogOptions): string => {
    const id = nextId('dialog');
    setItems(previous => [...previous, { id, options, type: 'dialog' }]);
    return id;
  }, []);

  const showToast = useCallback((options: ToastOptions): string => {
    const id = nextId('toast');
    setItems(previous => [...previous, { id, options, type: 'toast' }]);
    return id;
  }, []);

  const showSnackBar = useCallback((options: SnackbarOptions): string => {
    const id = nextId('snackbar');
    setItems(previous => [
      ...previous,
      { id, options, type: 'snackbar' },
    ]);
    return id;
  }, []);

  const closeDialog = useCallback((id?: string): void => {
    setItems(previous => {
      if (id === undefined) {
        // Without an id we close all dialogs (toasts and snackbars are
        // managed via `closeDialog` per-id, called by their own timer).
        return previous.filter(item => item.type !== 'dialog');
      }
      return previous.filter(item => item.id !== id);
    });
  }, []);

  const closeAll = useCallback((): void => {
    setItems([]);
  }, []);

  return { closeAll, closeDialog, items, showDialog, showSnackBar, showToast };
}
