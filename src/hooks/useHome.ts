import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import { Paths } from '@navigation/paths';
import AppNavigator from '@navigation/AppNavigator';
import useNotification from './useNotification';
import {
  getProfileRequest,
  updateMembershipRequest,
} from '@services/slices/account/accountSlice';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MEMBERSHIP_OPTIONS, MEMBERSHIP_TYPE } from '@constants/config';
import Information from '@screens/Dialog/components/Information';
import ChooseMemberShipType from '../screens/Authorisation/components/RegisterFlow/ChooseMemberShipType';
import BankInformation from '../screens/Authorisation/components/RegisterFlow/BankInformation';

export type UseHome = ReturnType<typeof useHome>;

const membershipOptions = MEMBERSHIP_OPTIONS.filter(
  it => it.id != 'NON_MEMBER',
);
const openMenu = () => {
  AppNavigator.showMenu();
};

const goToProfile = () => {
  // AppNavigator.navigate(Paths.Profile);
};

const onPressStore = () => {
  AppNavigator.navigate(Paths.Stores);
};

const onPressNotification = () => {
  AppNavigator.navigate(Paths.Notifications);
};

const onPressNotice = () => {
  AppNavigator.navigate(Paths.Announcements);
};

const onPressSurvey = () => {
  AppNavigator.navigate(Paths.Survey);
};

export const useHome = () => {
  const { t } = useTranslation();
  const profile = useAppSelector(AccountSelector.getProfile);
  useNotification();
  const dispatch = useAppDispatch();

  const isShowCtaContribute = useMemo(() => {
    return !(
      profile?.membershipType != MEMBERSHIP_TYPE.NON_MEMBER &&
      profile?.registrationStatus == 'COMPLETED'
    );
  }, [profile]);

  const onSubmitMemberShip = selectedId => {
    AppNavigator.showDialog({
      screen: Information,
      desc: t('register_flow.contribution_dialog.desc'),
      cancelTitle: t('common.cancel'),
      confirmTitle: t('common.confirm'),
      onConfirm: () => {
        dispatch(
          updateMembershipRequest({
            membershipType: selectedId,
            onFailure: message => {
              AppNavigator.showSnackBar({
                message: message || '',
                type: 'failed',
              });
            },
            onSuccess: () => {
              AppNavigator.showDialog({
                screen: BankInformation,
                isFullScreen: true,
                cancelable: false,
                onSubmit: () => {
                  AppNavigator.hideAllPopup();
                  dispatch(getProfileRequest());
                },
              });
            },
          }),
        );
      },
    });
  };
  const onShowMemberShip = () => {
    AppNavigator.showDialog({
      isFullScreen: true,
      cancelable: false,
      showBtnBack: true,
      onBack: () => {
        AppNavigator.hideAllPopup();
      },
      screen: ChooseMemberShipType,
      options: membershipOptions,
      onSubmit: onSubmitMemberShip,
    });
  };

  const onPressContribution = () => {
    if (profile?.membershipType == MEMBERSHIP_TYPE.NON_MEMBER) {
      AppNavigator.showDialog({
        screen: Information,
        title: t('home.non_member_dialog.title'),
        cancelTitle: t('home.non_member_dialog.cancel'),
        confirmTitle: t('home.non_member_dialog.confirm'),
        onConfirm: () => {
          onShowMemberShip();
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
  };

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
    isShowCtaContribute,
    onPressStore,
    onPressContribution,
    onGoToStore,
    onPressNotice,
    onPressNotification,
    onPressSurvey,
  };
};
