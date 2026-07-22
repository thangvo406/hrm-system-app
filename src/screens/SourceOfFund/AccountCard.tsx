import type { SourceAccount } from '@hooks/useSourceOfFund';

import { Image } from '@components';
import { ScaleSize } from '@kits/core';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const CHEVRON_SIZE = ScaleSize(18);
const ACCOUNT_GRADIENTS: readonly (readonly string[])[] = [
  ['#3B6BE0', '#274BB0'],
  ['#1F2A44', '#0E1526'],
];

type Properties = {
  readonly account: SourceAccount;
  readonly index: number;
  readonly width: number;
};

function AccountCard({ account, index, width }: Properties) {
  const colors = ACCOUNT_GRADIENTS[index % ACCOUNT_GRADIENTS.length];
  return (
    <LinearGradient
      colors={[...colors]}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={[styles.card, { width }]}
    >
      <View style={styles.info}>
        <Text style={styles.bankName}>{account.bankName}</Text>
        <Text style={styles.account}>{account.accountMasked}</Text>
      </View>
      <View style={styles.chevron}>
        <Image
          color="#FFFFFF"
          height={CHEVRON_SIZE}
          name="ic_chevron_right"
          type="svg"
          width={CHEVRON_SIZE}
        />
      </View>
    </LinearGradient>
  );
}

export default React.memo(AccountCard);

const styles = StyleSheet.create({
  account: {
    color: '#FFFFFF',
    fontSize: ScaleSize(15),
    letterSpacing: ScaleSize(1),
    marginTop: ScaleSize(8),
    opacity: 0.9,
  },
  bankName: {
    color: '#FFFFFF',
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  card: {
    alignItems: 'center',
    borderRadius: ScaleSize(16),
    flexDirection: 'row',
    height: ScaleSize(96),
    justifyContent: 'space-between',
    paddingHorizontal: ScaleSize(20),
  },
  chevron: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: ScaleSize(15),
    height: ScaleSize(30),
    justifyContent: 'center',
    width: ScaleSize(30),
  },
  info: {
    flex: 1,
  },
});
