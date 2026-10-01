import type { DialogScreenHandle } from '@screens/Dialog/types';
import type { IconName } from '@assets/icons';
import type { KeyboardTypeOptions } from 'react-native';

export type TSelectionItem = {
  readonly icon?: IconName;
  readonly iconType?: string;
  readonly id: string;
  readonly label: string;
};

/** Nhánh giao diện của bottom sheet chọn giá trị. */
export type TSelectionVariant = 'list' | 'timeSheet';

type TSelectionListProps = {
  readonly emptyType?: string;
  readonly items: readonly TSelectionItem[];
  readonly itemSelected?: Record<string, unknown> | string;
  readonly onSelect: (item: any) => void;
  readonly pathDisplay?: string;
  readonly pathSelected?: string;
  readonly searchKeyboardType?: KeyboardTypeOptions;
  readonly showSearchBar?: boolean;
  readonly type?: 'list';
};

type TSelectionTimeProps = {
  readonly minuteStep?: number;
  readonly onConfirm: (time: string) => void;
  readonly type: 'timeSheet';
  readonly value: string;
};

type TSelectionSharedProps = {
  readonly title?: string;
} & Partial<DialogScreenHandle>;

export type TSelectionProps = (TSelectionListProps | TSelectionTimeProps) &
  TSelectionSharedProps;
