import type {
  DialogItem,
  DialogOptions,
  MenuOptions,
  SnackbarOptions,
  ToastOptions,
} from './types';

import { useCallback, useState } from 'react';

let counter = 0;
const nextId = (prefix: 'dialog' | 'menu' | 'snackbar' | 'toast'): string => {
  counter += 1;
  return `${prefix}_${Date.now()}_${counter}`;
};

export type DialogManager = {
  readonly closeAll: () => void;
  readonly closeDialog: (id?: string) => void;
  readonly closeMenu: () => void;
  readonly items: readonly DialogItem[];
  readonly showDialog: (options: DialogOptions) => string;
  readonly showMenu: (options?: MenuOptions) => string;
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
    setItems(previous => [...previous, { id, options, type: 'snackbar' }]);
    return id;
  }, []);

  const showMenu = useCallback((options: MenuOptions = {}): string => {
    const id = nextId('menu');
    setItems(previous => [
      // Only one menu can be open at a time — drop any existing menu first.
      ...previous.filter(item => item.type !== 'menu'),
      { id, options, type: 'menu' },
    ]);
    return id;
  }, []);

  const closeMenu = useCallback((): void => {
    setItems(previous => previous.filter(item => item.type !== 'menu'));
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

  return {
    closeAll,
    closeDialog,
    closeMenu,
    items,
    showDialog,
    showMenu,
    showSnackBar,
    showToast,
  };
}
