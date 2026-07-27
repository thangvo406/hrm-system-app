import type { ImageName } from '@assets/images';

import imageNames from '@assets/images/names';
import { REQUEST_ADD_CARD_METHOD_TYPES } from '@constants/config';
import RegisterCartConfirm from '@dialogs/RegisterCartConfirm';
import AppNavigator from '@navigation/AppNavigator';
import { useCallback, useState } from 'react';

export type RegisterMethodKey = typeof REQUEST_ADD_CARD_METHOD_TYPES;

export type RegisterMethod = {
  readonly badgeColor: string;
  readonly descriptionKey: string;
  readonly icon: ImageName;
  readonly key: RegisterMethodKey;
  readonly titleKey: string;
};

const CARD_BADGE_COLOR = '#E8F5E9';
const ACCOUNT_BADGE_COLOR = '#EFEFEF';

export const useRegisterCard = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>(
    REQUEST_ADD_CARD_METHOD_TYPES.CARD,
  );

  const methods: readonly RegisterMethod[] = [
    {
      badgeColor: CARD_BADGE_COLOR,
      descriptionKey: 'register_card.card_desc',
      icon: imageNames.ic_credit_card_green,
      key: REQUEST_ADD_CARD_METHOD_TYPES.CARD,
      titleKey: 'register_card.card_title',
    },
    {
      badgeColor: ACCOUNT_BADGE_COLOR,
      descriptionKey: 'register_card.account_desc',
      icon: imageNames.ic_bank_green,
      key: REQUEST_ADD_CARD_METHOD_TYPES.ACCOUNT,
      titleKey: 'register_card.account_title',
    },
  ];

  const onSelectMethod = useCallback((key: RegisterMethodKey) => {
    setSelectedMethod(key);
  }, []);

  const onSubmit = useCallback(() => {
    // TODO: navigate to the card / account registration flow once available.
    if (selectedMethod == REQUEST_ADD_CARD_METHOD_TYPES.CARD) {
      AppNavigator.showDialog({
        screen: RegisterCartConfirm,
        popupType: 'bottomSheet',
        // onConfirm: () => AppNavigator.navigate(Paths.RegisterCard),
        onPressItem: (key: string) => {
          // open the matching terms page
        },
      });
    }
  }, [selectedMethod]);

  return {
    methods,
    onSelectMethod,
    onSubmit,
    selectedMethod,
  };
};
