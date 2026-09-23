import type { Profile } from '@services/request/account';
import type { TProfileInfoSection } from '@type/profile';

import AppNavigator from '@navigation/AppNavigator';
import { AccountSelector } from '@services/selectors';
import { getInitials } from '@utils/profile';
import { useAppSelector } from '@services/common/storeHooks';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Dựng hai nhóm trường từ hồ sơ trong redux.
 *
 * Kiểu `Profile` của API hiện chỉ có `fullName`, `email`, `phone`, `username`,
 * `accountStatus`, `createdAt`. Ngày sinh, giới tính, địa chỉ, quốc tịch và
 * tình trạng hôn nhân CHƯA có — những trường đó hiện "chưa cập nhật" chứ không
 * bịa dữ liệu, để nhìn màn là biết ngay backend còn thiếu gì.
 */
const buildSections = (
  profile: Profile | undefined,
  placeholder: string,
): readonly TProfileInfoSection[] => [
  {
    fields: [
      {
        icon: 'user',
        id: 'full_name',
        labelKey: 'profile_information.field_full_name',
        value: profile?.fullName || placeholder,
      },
      {
        icon: 'ic_calendar',
        id: 'birthday',
        labelKey: 'profile_information.field_birthday',
        value: placeholder,
      },
      {
        icon: 'ic_gender',
        id: 'gender',
        labelKey: 'profile_information.field_gender',
        value: placeholder,
      },
      {
        icon: 'ic_phone',
        id: 'phone',
        labelKey: 'profile_information.field_phone',
        value: profile?.phone || placeholder,
      },
      {
        icon: 'ic_mail',
        id: 'email',
        labelKey: 'profile_information.field_email',
        value: profile?.email || placeholder,
      },
      {
        icon: 'ic_location',
        id: 'address',
        labelKey: 'profile_information.field_address',
        value: placeholder,
      },
    ],
    id: 'basic',
    titleKey: 'profile_information.section_basic',
  },
  {
    fields: [
      {
        icon: 'ic_globe',
        id: 'nationality',
        labelKey: 'profile_information.field_nationality',
        value: placeholder,
      },
      {
        icon: 'ic_heart',
        id: 'marital_status',
        labelKey: 'profile_information.field_marital_status',
        value: placeholder,
      },
    ],
    id: 'other',
    titleKey: 'profile_information.section_other',
  },
];

/** Toàn bộ logic màn Thông tin cá nhân. */
export function useProfileInformation() {
  const profile = useAppSelector(AccountSelector.getProfile);
  const { t } = useTranslation();

  const employee = useMemo(
    () => ({
      fullName: profile?.fullName ?? '',
      initials: getInitials(profile?.fullName),
      // Chức danh chưa có trong kiểu `Profile`; thẻ avatar tự bỏ dòng này.
      jobTitle: '',
    }),
    [profile],
  );

  const sections = useMemo(
    () => buildSections(profile, t('profile_information.not_updated')),
    [profile, t],
  );

  const onGoBack = useCallback(() => {
    AppNavigator.goBack();
  }, []);

  // Chưa nối luồng chọn ảnh: chỗ nối sẵn cho sau.
  const onChangePhoto = useCallback(() => {}, []);

  return {
    employee,
    onChangePhoto,
    onGoBack,
    sections,
  };
}
