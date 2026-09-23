import type { TProfileEmployee, TProfileMenuSection } from '@type/profile';

import AppNavigator from '@navigation/AppNavigator';
import { AccountSelector } from '@services/selectors';
import { AppConstants } from '@constants';
import { getInitials } from '@utils/profile';
import { AppStacks, Paths } from '@navigation/paths';
import { logout } from '@services/slices/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { useCallback, useMemo } from 'react';

/** Trống nghĩa là hồ sơ chưa có dữ liệu — header sẽ không dựng dòng đó. */
const EMPTY_VALUE = '';

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

const MENU_PATHS: Readonly<Record<string, Paths | undefined>> = {
  personal_info: Paths.ProfileInformation,
};

export function useProfile() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(AccountSelector.getProfile);

  /**
   * Hồ sơ lấy thẳng từ redux (`account.profile`, do saga `getProfileRequest`
   * nạp ở màn Trang chủ). Chức danh và phòng ban chưa có trong kiểu `Profile`
   * của API nên để rỗng — header tự bỏ hai dòng đó thay vì hiện chỗ trống.
   */
  const employee: TProfileEmployee = useMemo(
    () => ({
      department: EMPTY_VALUE,
      fullName: profile?.fullName ?? EMPTY_VALUE,
      initials: getInitials(profile?.fullName),
      jobTitle: EMPTY_VALUE,
    }),
    [profile],
  );

  const menuValues = useMemo(() => ({ version: AppConstants.APP_VERSION }), []);

  const onLogout = useCallback(() => {
    dispatch(logout());
    AppNavigator.reset(AppStacks.Auth);
  }, [dispatch]);

  const onPressItem = useCallback((id: string) => {
    const path = MENU_PATHS[id];
    if (path) {
      AppNavigator.navigate(path);
    }
  }, []);

  return {
    employee,
    menuValues,
    onLogout,
    onPressItem,
    sections: MENU_SECTIONS,
  };
}
