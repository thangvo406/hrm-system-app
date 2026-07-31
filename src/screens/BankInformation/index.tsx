import type { RootScreenProps } from '@navigation/types';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useBankInformation } from '@hooks';
import BankInformationView from './BankInformationView';

const SCREEN_BG = '#FFFFFF';

function BankInformation(props: RootScreenProps<Paths.BankInformation>) {
  const insets = useSafeAreaInsets();
  const { accountNumber, amount, bankName, goFrom, schoolName } =
    AppNavigator.getParams(props) || {};
  const { onSubmit } = useBankInformation(goFrom);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <BankInformationView
        accountNumber={accountNumber}
        amount={amount}
        bankName={bankName}
        onSubmit={onSubmit}
        titleBtn="bank_information.go_home"
        schoolName={schoolName}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: SCREEN_BG,
    flex: 1,
  },
});

export default BankInformation;
