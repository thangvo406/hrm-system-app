import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';

// Where the screen was opened from — drives what the "Next" button does.
export type BankInformationOrigin = 'register' | 'topUp';

export const useBankInformation = (goFrom?: BankInformationOrigin) => {
  const onSubmit = () => {
    if (goFrom === 'register') {
      AppNavigator.navigate(Paths.RegisterCompleted, {
        isHideContribution: true,
      });
      return;
    }
    AppNavigator.reset(Paths.AppTabs, { screen: Paths.Home });
  };

  return { onSubmit };
};
