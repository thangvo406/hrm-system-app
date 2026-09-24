import type { TSelectionItem } from '@type/dialog';
import type { TProfileEmployee, TProfileMenuSection } from '@type/profile';

import AppNavigator from '@navigation/AppNavigator';
import Selection from '@dialogs/Selection';
import { AccountSelector } from '@services/selectors';
import { AppConstants } from '@constants';
import { AppState, Linking } from 'react-native';
import { AppStacks, Paths } from '@navigation/paths';
import { logout } from '@services/slices/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useI18n } from '@hooks/language/useI18n';
import { useTranslation } from 'react-i18next';
import {
  getInitials,
  isNotificationEnabled,
  LANGUAGE_FLAGS,
  LANGUAGE_LABELS,
  LANGUAGE_OPTIONS,
} from '@utils/profile';

/** Trống nghĩa là hồ sơ chưa có dữ liệu — header sẽ không dựng dòng đó. */
const EMPTY_VALUE = '';

const MENU_LANGUAGE_ID = 'language';
const MENU_NOTIFICATIONS_ID = 'notifications';

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
      // dòng dưới chỉ để đọc.
      {
        icon: 'ic_globe',
        id: MENU_LANGUAGE_ID,
        subtitleKey: 'profile.item_language_subtitle',
        titleKey: 'profile.item_language',
      },
      {
        icon: 'ic_bell',
        id: MENU_NOTIFICATIONS_ID,
        subtitleKey: 'profile.item_notifications_subtitle',
        titleKey: 'profile.item_notifications',
      },
    ],
    titleKey: 'profile.section_support',
  },
];

const MENU_PATHS: Readonly<Record<string, Paths | undefined>> = {
  personal_info: Paths.ProfileInformation,
  work_info: Paths.WorkspaceInformation,
};

export function useProfile() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(AccountSelector.getProfile);
  const { t } = useTranslation();
  const { changeLanguage, currentLanguage } = useI18n();
  // `undefined` là chưa hỏi xong quyền: để trống còn hơn nháy nhầm "Đang tắt".
  const [isNotificationOn, setIsNotificationOn] = useState<boolean | undefined>(
    undefined,
  );

  /**
   * Quyền thông báo đọc lại mỗi lần app quay về foreground: dòng "Thông báo"
   * đưa người dùng sang cài đặt máy, lúc họ bấm quay lại thì trạng thái cũ đã
   * sai.
   */
  useEffect(() => {
    const syncNotificationState = () => {
      isNotificationEnabled()
        .then(setIsNotificationOn)
        .catch(() => undefined);
    };

    syncNotificationState();
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        syncNotificationState();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

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

  const menuValues = useMemo(
    () => ({
      language: LANGUAGE_LABELS[currentLanguage],
      notificationStatus:
        isNotificationOn === undefined
          ? EMPTY_VALUE
          : t(
              isNotificationOn
                ? 'profile.notification_on'
                : 'profile.notification_off',
            ),
      version: AppConstants.APP_VERSION,
    }),
    [currentLanguage, isNotificationOn, t],
  );

  /** Bộ chọn ngôn ngữ: bottom sheet dùng chung, chọn xong đổi luôn. */
  const onPickLanguage = useCallback(() => {
    const items: readonly TSelectionItem[] = LANGUAGE_OPTIONS.map(language => ({
      icon: LANGUAGE_FLAGS[language],
      id: language,
      label: LANGUAGE_LABELS[language],
    }));

    AppNavigator.showDialog({
      screen: Selection,
      popupType: 'bottomSheet',
      items,
      // Truyền nguyên item chứ không phải id: bấm "Xác nhận" mà không chọn lại
      // thì `Selection` trả về đúng giá trị khởi tạo này.
      itemSelected: items.find(item => item.id === currentLanguage),
      onSelect: (item: TSelectionItem) => {
        const language = LANGUAGE_OPTIONS.find(option => option === item.id);
        if (language) {
          changeLanguage(language);
        }
      },
      pathDisplay: 'label',
      pathSelected: 'id',
      showSearchBar: false,
      title: t('profile.item_language'),
    });
  }, [changeLanguage, currentLanguage, t]);

  const onLogout = useCallback(() => {
    dispatch(logout());
    AppNavigator.reset(AppStacks.Auth, {
      screen: Paths.Authorization,
    });
  }, [dispatch]);

  const onPressItem = useCallback(
    (id: string) => {
      if (id === MENU_LANGUAGE_ID) {
        onPickLanguage();
        return;
      }

      if (id === MENU_NOTIFICATIONS_ID) {
        Linking.openSettings()
          .then(() => undefined)
          .catch(() => undefined);
        return;
      }

      const path = MENU_PATHS[id];
      if (path) {
        AppNavigator.navigate(path);
      }
    },
    [onPickLanguage],
  );

  return {
    employee,
    menuValues,
    onLogout,
    onPressItem,
    sections: MENU_SECTIONS,
  };
}
