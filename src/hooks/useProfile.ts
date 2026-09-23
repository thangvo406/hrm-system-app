import type { TProfileEmployee, TProfileMenuSection } from '@type/profile';

import { AppConstants } from '@constants';
import { logout } from '@services/slices/auth/authSlice';
import { useAppDispatch } from '@services/common/storeHooks';
import { useCallback, useMemo } from 'react';

// ─── Mock data ────────────────────────────────────────────────────────────────
// Phần hồ sơ dựng UI, chưa nối API. Khi có endpoint thật thì đọc từ
// `AccountSelector.getProfile` thay cho khối này.

const MOCK_EMPLOYEE: TProfileEmployee = {
  contacts: [
    {
      icon: 'ic_mail',
      id: 'email',
      labelKey: 'profile.contact_email',
      value: 'nguyenvana@company.com',
    },
    {
      icon: 'ic_phone',
      id: 'phone',
      labelKey: 'profile.contact_phone',
      value: '0123 456 789',
    },
    {
      icon: 'ic_building',
      id: 'office',
      labelKey: 'profile.contact_office',
      value: 'TP. Hồ Chí Minh',
    },
  ],
  department: 'Phòng Công nghệ thông tin',
  fullName: 'Nguyễn Văn A',
  initials: 'NA',
  jobTitle: 'Mobile Developer',
};

// ──────────────────────────────────────────────────────────────────────────────

const MENU_SECTIONS: readonly TProfileMenuSection[] = [
  {
    id: 'personal',
    items: [
      {
        icon: 'user',
        id: 'personal_info',
        subtitleKey: 'profile.item_personal_info_subtitle',
        titleKey: 'profile.item_personal_info',
      },
      {
        icon: 'ic_document',
        id: 'work_info',
        subtitleKey: 'profile.item_work_info_subtitle',
        titleKey: 'profile.item_work_info',
      },
      {
        icon: 'ic_shield',
        id: 'account_info',
        subtitleKey: 'profile.item_account_info_subtitle',
        titleKey: 'profile.item_account_info',
      },
    ],
    titleKey: 'profile.section_personal',
  },
  {
    id: 'support',
    items: [
      {
        icon: 'ic_help',
        id: 'help_center',
        subtitleKey: 'profile.item_help_center_subtitle',
        titleKey: 'profile.item_help_center',
      },
      {
        icon: 'ic_message',
        id: 'feedback',
        subtitleKey: 'profile.item_feedback_subtitle',
        titleKey: 'profile.item_feedback',
      },
      {
        icon: 'ic_info',
        id: 'about',
        subtitleKey: 'profile.item_about_subtitle',
        titleKey: 'profile.item_about',
      },
    ],
    titleKey: 'profile.section_support',
  },
];

/** Toàn bộ logic màn Cá nhân: hồ sơ, các nhóm menu và đăng xuất. */
export function useProfile() {
  const dispatch = useAppDispatch();

  // Chỉ mục "Giới thiệu ứng dụng" cần giá trị chèn; gom sẵn một lần cho cả hai
  // nhóm thay vì mỗi dòng tự tra.
  const menuValues = useMemo(() => ({ version: AppConstants.APP_VERSION }), []);

  // Saga `logout` lo phần dọn dẹp rồi reset về stack Auth.
  const onLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  // Chưa có màn đích cho từng mục: chỗ nối sẵn cho sau.
  const onPressItem = useCallback(() => {}, []);

  return {
    employee: MOCK_EMPLOYEE,
    menuValues,
    onLogout,
    onPressItem,
    sections: MENU_SECTIONS,
  };
}
