import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import {
  AccountSelector,
  AuthSelector,
  StoresSelector,
} from '@services/selectors';
import { Paths } from '@navigation/paths';
import AppNavigator from '@navigation/AppNavigator';
import useNotification from './useNotification';
import { getProfileRequest } from '@services/slices/account/accountSlice';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MEMBERSHIP_TYPE } from '@constants/config';
import Information from '@screens/Dialog/components/Information';
import { useFocusEffect } from '@react-navigation/native';
import { getCurrentWalletRequest } from '@services/slices/account/accountSlice';
import { getStoreOrderRecentRequest } from '@services/slices/stores/storesSlice';
import { AppStorage } from '@services/common/storage';
import { AppConstants } from '@constants';
import SocketService from '@services/common/webSocket';
import imageNames from '@assets/images/names';
//TODO: should remove it
// import RegisterMembership from '@dialogs/RegisterMembership';

export type UseHome = ReturnType<typeof useHome>;

const openMenu = () => {
  AppNavigator.showMenu();
};

const goToPayCard = () => {
  AppNavigator.navigate(Paths.SourceOfFund);
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

const onPressContribution = () => {
  AppNavigator.navigate(Paths.ContributionHistory);
};

const onShowMemberShip = () => {
  AppNavigator.navigate(Paths.RegisterCard);
};

const onPressVoucher = () => {
  AppNavigator.navigate(Paths.Vouchers);
};

export const useHome = () => {
  const { t } = useTranslation();
  const profile = useAppSelector(AccountSelector.getProfile);
  const currentWallet = useAppSelector(AccountSelector.getCurrentWallet);
  const storeOrderRecent = useAppSelector(StoresSelector.getStoreOrderRecent);
  const accessToken = useAppSelector(AuthSelector.getAccessToken);
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

  useEffect(() => {
    if (!accessToken) return;
    SocketService.connect(accessToken);
    return () => {
      SocketService.disconnect();
    };
  }, [accessToken]);

  const onPressTopup = () => {
    if (
      !profile?.membershipType ||
      profile?.membershipType == MEMBERSHIP_TYPE.NON_MEMBER
    ) {
      AppNavigator.showDialog({
        screen: Information,
        iconInfo: {
          name: imageNames.ic_bank_info,
        },
        title: t('home.non_member_dialog.title'),
        desc: t('home.non_member_dialog.desc'),
        cancelTitle: t('home.non_member_dialog.cancel'),
        confirmTitle: t('home.non_member_dialog.confirm'),
        onConfirm: () => {
          onShowMemberShip();
        },
      });
    } else {
      AppNavigator.navigate(Paths.TopUp);
    }
  };

  const onGoToProduct = (productId: number) => {
    AppNavigator.navigate(Paths.ProductDetail, {
      id: productId,
      storeId: storeOrderRecent?.id,
    });
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
    onPressTopup,
    onGoToProduct,
    onPressVoucher,
    onPressEmptyStore: onPressStore,
    onPressStore,
    onPressContribution,
    onGoToStore,
    onPressNotice,
    onPressNotification,
    onPressSurvey,
  };
};
