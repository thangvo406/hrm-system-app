import type { IAccount } from '@type';

import imageNames from '@assets/images/names';
import { BANK_ACC_TYPES } from '@constants/config';
import BankSettings from '@dialogs/BankSettings';
import Information from '@dialogs/Information';
import RequestAddCard from '@dialogs/RequestAddCard';
import AppNavigator from '@navigation/AppNavigator';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountManagementSelector } from '@services/selectors';
import {
  getAccountCardsRequest,
  lockCardAccountRequest,
  removeCardAccountRequest,
} from '@services/slices/accountManagement/accountManagementSlice';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const PRIMARY_CARD_INDEX = 1;

const onPressAddCard = () => {
  AppNavigator.showDialog({
    screen: RequestAddCard,
    isFullScreen: true,
  });
};

const onFailure = (message: string) => {
  AppNavigator.showSnackBar({ message, type: 'failed' });
};

/** Accepts both the caller shorthand ('card') and `BANK_ACC_TYPES.CARD`. */
const isCardType = (type: string) =>
  type.toUpperCase().includes(BANK_ACC_TYPES.CARD);

export type SectionKey = 'accounts' | 'cards';

const EXPANDED_SECTIONS_DEFAULT: Record<SectionKey, boolean> = {
  accounts: true,
  cards: true,
};

export const useBankAccount = () => {
  const rawData = useAppSelector(AccountManagementSelector.getAccountCards);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState(
    EXPANDED_SECTIONS_DEFAULT,
  );

  const accounts = useMemo(() => {
    return rawData?.filter(it => it.type == BANK_ACC_TYPES.ACCOUNT);
  }, [rawData]);

  const cards = useMemo(() => {
    return rawData?.filter(it => it.type == BANK_ACC_TYPES.CARD);
  }, [rawData]);

  const onExecuteRemoveItem = (item: IAccount) => {
    dispatch(
      removeCardAccountRequest({
        id: Number(item.id),
        onFailure,
        onSuccess: () => {
          dispatch(getAccountCardsRequest({}));
          AppNavigator.showSnackBar({
            message: t('account_management.remove_success'),
            type: 'success',
          });
        },
      }),
    );
  };

  const onExecuteLockItem = (item: IAccount) => {
    dispatch(
      lockCardAccountRequest({
        id: Number(item.id),
        onFailure,
        onSuccess: () => {
          dispatch(getAccountCardsRequest({}));

          AppNavigator.showSnackBar({
            message: t('account_management.lock_success'),
            type: 'success',
          });
        },
      }),
    );
  };

  const onRemoveItem = (type: string) => (item: IAccount) => {
    AppNavigator.showDialog({
      screen: Information,
      iconInfo: {
        name: imageNames.ic_bank_info,
      },
      title: t('account_management.remove_confirm_title'),
      desc: t(
        isCardType(type)
          ? 'account_management.remove_card_confirm_desc'
          : 'account_management.remove_account_confirm_desc',
      ),
      cancelTitle: t('common.cancel'),
      confirmTitle: t('common.confirm'),
      onConfirm: () => {
        onExecuteRemoveItem(item);
      },
    });
  };

  // "Unlink" from the settings sheet is the same destructive removal, so it
  // goes through the same confirmation.
  const onPressUnlink = (type: string, item: IAccount) => () => {
    onRemoveItem(type)(item);
  };

  const onPressLock = (type: string, item: IAccount) => () => {
    AppNavigator.showDialog({
      screen: Information,
      iconInfo: {
        name: imageNames.ic_bank_info,
      },
      title: t('account_management.lock_confirm_title'),
      desc: t(
        isCardType(type)
          ? 'account_management.lock_card_confirm_desc'
          : 'account_management.lock_account_confirm_desc',
      ),
      cancelTitle: t('common.cancel'),
      confirmTitle: t('common.confirm'),
      onConfirm: () => {
        onExecuteLockItem(item);
      },
    });
  };

  const onSettingsItem = (type: string) => (item: IAccount) => {
    AppNavigator.showDialog({
      screen: BankSettings,
      popupType: 'bottomSheet',
      onLock: onPressLock(type, item),
      onUnlink: onPressUnlink(type, item),
    });
  };

  const onToggleSection = (section: SectionKey) => () => {
    setExpandedSections(previous => ({
      ...previous,
      [section]: !previous[section],
    }));
  };

  return {
    accounts,
    cards,
    expandedSections,
    onPressAddCard,
    onRemoveItem,
    onSettingsItem,
    onToggleSection,
  };
};
