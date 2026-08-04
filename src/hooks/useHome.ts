import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import {
  AccountManagementSelector,
  AccountSelector,
  AppSelector,
  AuthSelector,
  StoresSelector,
} from '@services/selectors';
import { Paths } from '@navigation/paths';
import AppNavigator from '@navigation/AppNavigator';
import useNotification from './useNotification';
import { getProfileRequest } from '@services/slices/account/accountSlice';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GRADE_MEMBERSHIP_TYPE, MEMBERSHIP_TYPE } from '@constants/config';
import Information from '@screens/Dialog/components/Information';
import { useFocusEffect } from '@react-navigation/native';
import { getCurrentWalletRequest } from '@services/slices/account/accountSlice';
import { getStoreOrderRecentRequest } from '@services/slices/stores/storesSlice';
import { AppStorage } from '@services/common/storage';
import { AppConstants } from '@constants';
import SocketService from '@services/common/webSocket';
import imageNames from '@assets/images/names';
import RequestAddCard from '@dialogs/RequestAddCard';
import { getAccountCardsRequest } from '@services/slices/accountManagement/accountManagementSlice';
import { SchoolSelection } from '@screens';
import { selectSchoolRequest } from '@services/slices/auth/authSlice';
import { useReturnParams } from './useReturnParams';

export type UseHome = ReturnType<typeof useHome>;

const openMenu = () => {
  AppNavigator.showMenu();
};

const goToPayCard = () => {
  AppNavigator.navigate(Paths.AccountManagement);
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

const onPressVoucher = () => {
  AppNavigator.navigate(Paths.Vouchers);
};

const onPressMealTickets = () => {
  AppNavigator.navigate(Paths.MealTickets);
};

export const useHome = (props: any) => {
  const { t } = useTranslation();
  const profile = useAppSelector(AccountSelector.getProfile);
  const currentWallet = useAppSelector(AccountSelector.getCurrentWallet);
  const storeOrderRecent = useAppSelector(StoresSelector.getStoreOrderRecent);
  const accessToken = useAppSelector(AuthSelector.getAccessToken);
  const cards = useAppSelector(AccountManagementSelector.getAccountCards);
  const isEnablePaymentCard = useAppSelector(AppSelector.isEnablePaymentCard);

  useNotification();
  const dispatch = useAppDispatch();

  useReturnParams<{ destination: any }>(
    props,
    ['destination'],
    ({ destination }) => {
      if (destination) {
        AppNavigator.navigate(destination);
      }
    },
  );

  const isHideContribute =
    profile?.coopMemberGrade == GRADE_MEMBERSHIP_TYPE.GENERAL;

  const isShowCtaContribute = useMemo(() => {
    return !(
      profile?.membershipType != MEMBERSHIP_TYPE.NON_MEMBER &&
      profile?.registrationStatus == 'COMPLETED'
    );
  }, [profile]);

  useEffect(() => {
    dispatch(getAccountCardsRequest({}));
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    SocketService.connect(accessToken);
    return () => {
      SocketService.disconnect();
    };
  }, [accessToken]);

  const onShowRequestAddCard = () => {
    AppNavigator.showDialog({
      screen: RequestAddCard,
      isFullScreen: true,
    });
  };

  const onPressTopup = (screenName = Paths.TopUp) => {
    if (isEnablePaymentCard && !(cards?.length > 0)) {
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
          onShowRequestAddCard();
        },
      });
    } else {
      AppNavigator.navigate(screenName);
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
          onPressTopup(Paths.ContributionInput);
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

  const onSwitchSchool = (school: any) => {
    AppNavigator.hideAllPopup();
    dispatch(
      selectSchoolRequest({
        universityId: school?.id,
        onSuccess: () => {
          dispatch(getProfileRequest());
        },
        onFailure: error => {
          AppNavigator.showSnackBar({
            message: error,
            type: 'failed',
          });
        },
      }),
    );
  };
  const onPressSwitchSchool = () => {
    AppNavigator.showDialog({
      screen: SchoolSelection,
      isFullScreen: true,
      topHeader: 0,
      title: '대학을 선택해주세요',
      btnSubmit: t('common.confirm'),
      onSubmit: onSwitchSchool,
      onBack: () => {
        AppNavigator.hideAllPopup();
      },
    });
  };

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
    onPressMealTickets,
    onGoToStore,
    onPressNotice,
    onPressNotification,
    onPressSwitchSchool,
    onPressSurvey,
  };
};
