import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountSelector, StoresSelector } from '@services/selectors';
import { Paths } from '@navigation/paths';
import AppNavigator from '@navigation/AppNavigator';
import useNotification from './useNotification';
import {
  getProfileRequest,
  updateMembershipRequest,
} from '@services/slices/account/accountSlice';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MEMBERSHIP_OPTIONS, MEMBERSHIP_TYPE } from '@constants/config';
import Information from '@screens/Dialog/components/Information';
import ChooseMemberShipType from '../screens/Authorisation/components/RegisterFlow/ChooseMemberShipType';
import BankInformation from '../screens/Authorisation/components/RegisterFlow/BankInformation';
import { useFocusEffect } from '@react-navigation/native';
import { getCurrentWalletRequest } from '@services/slices/account/accountSlice';
import { getStoreOrderRecentRequest } from '@services/slices/stores/storesSlice';
import { AppStorage } from '@services/common/storage';
import { AppConstants } from '@constants';
// import Address from '@screens/Address';

export type UseHome = ReturnType<typeof useHome>;

const membershipOptions = MEMBERSHIP_OPTIONS.filter(
  it => it.id != 'NON_MEMBER',
);
const openMenu = () => {
  AppNavigator.showMenu();
};

const goToPayCard = () => {
  AppNavigator.navigate(Paths.ContributionHistory);
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

const onGoToStore = () => {
  AppNavigator.navigate(Paths.Products);
};

const onPressPayNow = () => {
  AppNavigator.navigate(Paths.QRCodePayment);
};

export const useHome = () => {
  const { t } = useTranslation();
  const profile = useAppSelector(AccountSelector.getProfile);
  const currentWallet = useAppSelector(AccountSelector.getCurrentWallet);
  const storeOrderRecent = useAppSelector(StoresSelector.getStoreOrderRecent);
  useNotification();
  const dispatch = useAppDispatch();

  const isHideContribute =
    profile?.membershipType == MEMBERSHIP_TYPE.NON_MEMBER;

  const isShowCtaContribute = useMemo(() => {
    return !(
      profile?.membershipType != MEMBERSHIP_TYPE.NON_MEMBER &&
      profile?.registrationStatus == 'COMPLETED'
    );
  }, [profile]);

  const onGoToProduct = (productId: number) => {
    AppNavigator.navigate(Paths.ProductDetail, {
      id: productId,
      storeId: storeOrderRecent?.id,
    });
  };
  const onSubmitMemberShip = (membershipType: string) => {
    AppNavigator.showDialog({
      screen: Information,
      desc: t('register_flow.contribution_dialog.desc'),
      cancelTitle: t('common.cancel'),
      confirmTitle: t('common.confirm'),
      onConfirm: () => {
        dispatch(
          updateMembershipRequest({
            membershipType,
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
      AppNavigator.navigate(Paths.ContributionInput);
    }
  };

  useEffect(() => {
    const needContribute = AppStorage.getBoolean(
      AppConstants.NEED_CONTRIBUTION_KEY,
    );
    if (needContribute) {
      AppStorage.set(AppConstants.NEED_CONTRIBUTION_KEY, false);
      AppNavigator.showDialog({
        cancelTitle: t('common.cancel'),
        confirmTitle: t('common.confirm'),
        onConfirm: () => {
          AppNavigator.navigate(Paths.ContributionInput);
        },
        screen: Information,
        title: t('home.need_contribution_dialog.title'),
      });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(getCurrentWalletRequest());
      dispatch(getProfileRequest());
      dispatch(getStoreOrderRecentRequest());
    }, []),
  );

  return {
    goToPayCard,
    openMenu,
    profile,
    currentWallet,
    isShowCtaContribute,
    storeOrderRecent,
    isHideContribute,
    onGoToProduct,
    onPressPayNow,
    onPressEmptyStore: onPressStore,
    onPressStore,
    onPressContribution,
    onGoToStore,
    onPressNotice,
    onPressNotification,
    onPressSurvey,
  };
};
