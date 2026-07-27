import type { IBankAccount } from '@hooks/useTopUp';

import { Image } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';

const CHEVRON_SIZE = ScaleSize(18);
const CARD_GRADIENTS: string[][] = [
  ['#3B6BE0', '#1E3AA8'],
  ['#7C4DFF', '#4527A0'],
  ['#00A9A5', '#00695C'],
  ['#FF7043', '#C63D0F'],
  ['#EC407A', '#AD1457'],
];

type Properties = {
  readonly account: IBankAccount;
  readonly index: number;
  readonly width: number;
};

function BankCard({ account, index, width }: Properties) {
  const colors = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  return (
    <LinearGradient
      colors={colors}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={[styles.card, { width }]}
    >
      <View style={styles.info}>
        <Text style={styles.bankName}>{account.displayName}</Text>
        <Text style={styles.account}>{account.displayNumber}</Text>
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

export default React.memo(BankCard);

const styles = StyleSheet.create({
  account: {
    color: '#FFFFFF',
    fontSize: ScaleSize(15),
    letterSpacing: ScaleSize(1),
    marginTop: ScaleSize(6),
    opacity: 0.9,
  },
  bankName: {
    color: '#FFFFFF',
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
  card: {
    alignItems: 'center',
    borderRadius: ScaleSize(16),
    flexDirection: 'row',
    height: ScaleSize(92),
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
