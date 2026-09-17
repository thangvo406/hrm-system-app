import type { ComponentType, ReactNode } from 'react';

export type DialogVariant = 'default' | 'success' | 'warning' | 'error';

export type ToastVariant = 'default' | 'success' | 'error';

export type SnackbarType = 'success' | 'failed' | 'info';

/**
 * Imperative close callback injected into the screen by the dialog host.
 * Any component rendered as a screen can call this to dismiss itself.
 */
export type DialogScreenHandle = {
  readonly onRequestClose: () => void;
};

/**
 * Base dialog options. The dialog is a thin wrapper around `screen` — the
 * caller passes a regular component (e.g. a DatePicker) and any extra props
 * are spread straight onto that component, alongside an `onRequestClose`
 * callback it can invoke to dismiss.
 *
 * Framework-level keys (consumed by the dialog host) are kept distinct from
 * the passthrough props the screen actually receives.
 */
export type DialogOptions = {
  readonly cancelable?: boolean;
  readonly isFullScreen?: boolean;
  readonly overlayColor?: string;
  readonly onDidAppear?: () => void;
  readonly onDismiss?: () => void;
  readonly screen: ComponentType<Record<string, unknown>>;
  readonly transparent?: boolean;
  readonly variant?: DialogVariant;
} & Record<string, unknown>;

/**
 * Bottom sheet options. Same shape as DialogOptions minus the
 * dialog-specific chrome flags (`isFullScreen`, `transparent`, `variant`).
 * Slides up from the bottom edge of the screen with a drag handle and
 * supports drag-down-to-dismiss (toggleable via `draggable`).
 */
export type BottomSheetOptions = {
  readonly cancelable?: boolean;
  readonly draggable?: boolean;
  readonly height?: number | string;
  readonly initialSnapIndex?: number;
  readonly onDidAppear?: () => void;
  readonly onDismiss?: () => void;
  readonly screen: ComponentType<Record<string, unknown>>;
  readonly snapPoints?: readonly (number | string)[];
} & Record<string, unknown>;

export type ToastOptions = {
  readonly description?: string;
  readonly duration?: number;
  readonly icon?: string;
  readonly position?: 'top' | 'bottom';
  readonly title: string;
  readonly variant?: ToastVariant;
};

export type SnackbarOptions = {
  readonly message: string;
  readonly type: SnackbarType;
};

export type DialogItemType = 'bottomSheet' | 'dialog' | 'snackbar' | 'toast';

export type DialogItem =
  | {
      readonly id: string;
      readonly options: BottomSheetOptions;
      readonly type: 'bottomSheet';
    }
  | {
      readonly id: string;
      readonly options: DialogOptions;
      readonly type: 'dialog';
    }
  | {
      readonly id: string;
      readonly options: ToastOptions;
      readonly type: 'toast';
    }
  | {
      readonly id: string;
      readonly options: SnackbarOptions;
      readonly type: 'snackbar';
    };

export type DialogHandle = {
  closeAll: () => void;
  closeBottomSheet: (id?: string) => void;
  closeDialog: (id?: string) => void;
  hideLoading: () => void;
  // setWillShow: (willShow: boolean) => void;
  showBottomSheet: (options: BottomSheetOptions) => string;
  showDialog: (options: DialogOptions) => string;
  showLoading: (options?: { readonly message?: string }) => string;
  showSnackBar: (options: SnackbarOptions) => string;
  showToast: (options: ToastOptions) => string;
};

export type DialogChildren = ReactNode;
