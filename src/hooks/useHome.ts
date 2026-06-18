import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import { Paths } from '@navigation/paths';
import AppNavigator from '@navigation/AppNavigator';
import useNotification from './useNotification';
import { getProfileRequest } from '@services/slices/account/accountSlice';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MEMBERSHIP_TYPE } from '@constants/config';
import Information from '@screens/Dialog/components/Information';

export type UseHome = ReturnType<typeof useHome>;

const openMenu = () => {
  AppNavigator.showMenu();
};

const goToProfile = () => {
  // AppNavigator.navigate(Paths.Profile);
};

const onPressOrder = () => {
  // AppNavigator.navigate(Paths.Contribution);
};

const onPressNotification = () => {
  AppNavigator.navigate(Paths.Notifications);
};

const onPressNotice = () => {
  AppNavigator.navigate(Paths.Announcements);
};

export const useHome = () => {
  const { t } = useTranslation();
  const profile = useAppSelector(AccountSelector.getProfile);
  useNotification();
  const dispatch = useAppDispatch();

  const onPressContribution = useCallback(() => {
    if (profile?.membershipType == MEMBERSHIP_TYPE.NON_MEMBER) {
      AppNavigator.showDialog({
        screen: Information,
        title: t('home.non_member_dialog.title'),
        cancelTitle: t('home.non_member_dialog.cancel'),
        confirmTitle: t('home.non_member_dialog.confirm'),
        onConfirm: () => {
          AppNavigator.navigate(Paths.Contribution);
        },
      });
    } else if (profile?.registrationStatus != 'COMPLETED') {
      AppNavigator.showDialog({
        screen: Information,
        title: t('home.pending_dialog.title'),
        confirmTitle: t('home.pending_dialog.confirm'),
      });
    } else {
      AppNavigator.navigate(Paths.Contribution);
    }
  }, [profile, t]);

  useEffect(() => {
    dispatch(getProfileRequest());
  }, []);

  const onGoToStore = () => {
    AppNavigator.navigate(Paths.Products);
  };

  return {
    goToProfile,
    openMenu,
    profile,
    onPressOrder,
    onPressContribution,
    onGoToStore,
    onPressNotice,
    onPressNotification,
  };
};
