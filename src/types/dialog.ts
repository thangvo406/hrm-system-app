import type { DialogScreenHandle } from '@screens/Dialog/types';
import type { IconName } from '@assets/icons';
import type { KeyboardTypeOptions } from 'react-native';

/** Một dòng trong bộ chọn dạng danh sách. */
export type TSelectionItem = {
  /** Biểu tượng đứng trước nhãn; bỏ trống thì dòng chỉ có chữ. */
  readonly icon?: IconName;
  readonly id: string;
  readonly label: string;
};

/** Nhánh giao diện của bottom sheet chọn giá trị. */
export type TSelectionVariant = 'list' | 'timeSheet';

/**
 * Nhánh danh sách: chọn một dòng, có ô tìm kiếm.
 *
 * `onSelect` nhận `any` vì `pathSelected`/`pathDisplay` cho phép truyền vào
 * danh sách có hình dạng khác `TSelectionItem` — hành vi này có từ trước và ba
 * nơi gọi hiện tại đang dựa vào.
 */
type TSelectionListProps = {
  readonly emptyType?: string;
  readonly items: readonly TSelectionItem[];
  readonly itemSelected?: Record<string, unknown> | string;
  readonly onSelect: (item: any) => void;
  readonly pathDisplay?: string;
  readonly pathSelected?: string;
  /** Bàn phím của ô tìm; ví dụ `number-pad` khi danh sách là mốc giờ. */
  readonly searchKeyboardType?: KeyboardTypeOptions;
  readonly showSearchBar?: boolean;
  readonly type?: 'list';
};

/** Nhánh chọn giờ: hai cột giờ và phút cuộn độc lập. */
type TSelectionTimeProps = {
  /** Bước của cột phút; mặc định `DEFAULT_MINUTE_STEP`. */
  readonly minuteStep?: number;
  readonly onConfirm: (time: string) => void;
  readonly type: 'timeSheet';
  /** Giá trị khởi tạo dạng `HH:mm`. */
  readonly value: string;
};

/** Phần khung chung, nhánh nào cũng có. */
type TSelectionSharedProps = {
  readonly title?: string;
} & Partial<DialogScreenHandle>;

/**
 * Props của `@dialogs/Selection`.
 *
 * Là union phân biệt bằng `type` để prop của nhánh này không lọt sang nhánh
 * kia. `AppNavigator.showDialog` nhận `any` nên chỗ gọi không được kiểm kiểu,
 * nhưng bên trong component thì union vẫn thu hẹp đúng.
 */
export type TSelectionProps = (TSelectionListProps | TSelectionTimeProps) &
  TSelectionSharedProps;
