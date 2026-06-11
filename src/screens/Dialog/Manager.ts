import type { DialogItem, DialogOptions, ToastOptions } from './types';

import { useCallback, useState } from 'react';

let counter = 0;
const nextId = (prefix: 'dialog' | 'toast'): string => {
  counter += 1;
  return `${prefix}_${Date.now()}_${counter}`;
};

export type DialogManager = {
  readonly closeAll: () => void;
  readonly closeDialog: (id?: string) => void;
  readonly items: readonly DialogItem[];
  readonly showDialog: (options: DialogOptions) => string;
  readonly showToast: (options: ToastOptions) => string;
};

/**
 * Holds the dialog/toast queue and exposes imperative mutators.
 * The returned `items` array drives the overlays rendered by the host component.
 * Multiple dialogs and toasts can live in the queue at the same time.
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

  const closeDialog = useCallback((id?: string): void => {
    setItems(previous => {
      if (id === undefined) {
        // Without an id we close all dialogs (toasts are managed via `closeDialog` per-id).
        return previous.filter(item => item.type !== 'dialog');
      }
      return previous.filter(item => item.id !== id);
    });
  }, []);

  const closeAll = useCallback((): void => {
    setItems([]);
  }, []);

  return { closeAll, closeDialog, items, showDialog, showToast };
}
