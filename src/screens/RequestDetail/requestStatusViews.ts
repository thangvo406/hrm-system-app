import type { IconName } from '@assets/icons';
import type { TApprovalStepStatus, TRequestStatus } from '@type/requests';

import { Colors } from '@constants';

/**
 * Mọi khác biệt của màn chi tiết theo trạng thái đơn gom về đúng một chỗ:
 * banner nói gì, tông màu nào, và có cho huỷ đơn hay không.
 *
 * Gom lại thay vì rải `if` khắp các component để thêm một trạng thái mới chỉ
 * phải sửa một nơi, và không bao giờ có cảnh banner xanh mà nút huỷ vẫn còn.
 */
export const REQUEST_STATUS_VIEWS: Record<
  TRequestStatus,
  {
    readonly background: string;
    readonly foreground: string;
    readonly icon: IconName;
    readonly messageKey: string;
    /** Chỉ đơn chưa ai xử lý mới rút lại được. */
    readonly showCancel: boolean;
    readonly titleKey: string;
  }
> = {
  approved: {
    background: Colors.green13,
    foreground: Colors.green12,
    icon: 'ic_check_circle',
    messageKey: 'request_detail.banner_approved_message',
    showCancel: false,
    titleKey: 'request_detail.banner_approved_title',
  },
  pending: {
    background: Colors.yellow06,
    foreground: Colors.yellow03,
    icon: 'ic_clock',
    messageKey: 'request_detail.banner_pending_message',
    showCancel: true,
    titleKey: 'request_detail.banner_pending_title',
  },
  rejected: {
    background: Colors.red02,
    foreground: Colors.red03,
    icon: 'x-circle',
    messageKey: 'request_detail.banner_rejected_message',
    showCancel: false,
    titleKey: 'request_detail.banner_rejected_title',
  },
};

/**
 * Màu và icon của từng nút trên đường phê duyệt.
 *
 * `continues` cho biết đơn có đi tiếp xuống bước sau hay không — đoạn nối bên
 * dưới nút chỉ tô xanh khi đúng. Duyệt xong thì đơn đi tiếp; đang chờ hoặc bị
 * từ chối thì nó dừng ngay tại đó.
 */
export const APPROVAL_STEP_VIEWS: Record<
  TApprovalStepStatus,
  {
    readonly background: string;
    readonly continues: boolean;
    readonly foreground: string;
    /** `undefined` là nút rỗng — bước chưa tới lượt. */
    readonly icon?: IconName;
    readonly noteKey?: string;
  }
> = {
  current: {
    background: Colors.yellow03,
    continues: false,
    foreground: Colors.white,
    icon: 'ic_clock',
    noteKey: 'request_detail.step_current',
  },
  done: {
    background: Colors.green12,
    continues: true,
    foreground: Colors.white,
    icon: 'ic_check',
    noteKey: 'request_detail.step_done',
  },
  rejected: {
    background: Colors.red03,
    continues: false,
    foreground: Colors.white,
    icon: 'ic_close',
    noteKey: 'request_detail.step_rejected',
  },
  waiting: {
    background: Colors.white,
    continues: false,
    foreground: Colors.gray15,
    noteKey: 'request_detail.step_waiting',
  },
};
