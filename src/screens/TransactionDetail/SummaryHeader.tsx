import { Colors } from '@constants';
import { Image } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

type Properties = {
  readonly date: string;
  readonly title: string;
  readonly storeName?: string;
  readonly amount?: string;
  readonly isDebit?: boolean;
};

const ICON_SIZE = 28;
const TITLE_MAX_LINES = 2;
const DEBIT = Colors.red03;
const CREDIT = Colors.green02;

function SummaryHeader({ amount, date, title, isDebit, storeName }: Properties) {
  const colorAmount = isDebit ? DEBIT : CREDIT;
  const sign = isDebit ? '-' : '+';
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Image
          color={Colors.green02}
          height={ScaleSize(ICON_SIZE)}
          name="ic_shopping_bag"
          type="svg"
          width={ScaleSize(ICON_SIZE)}
        />
      </View>
      <View style={styles.textCol}>
        {!!title && <Text style={styles.title}>{title}</Text>}
        <Text
          numberOfLines={TITLE_MAX_LINES}
          style={[styles.amount, { color: colorAmount }]}
        >
          {sign}
          {amount}
        </Text>
        {!!storeName && <Text style={styles.storeName}>{storeName}</Text>}
        <Text style={styles.date}>{date}</Text>
      </View>
    </View>
  );
}

export default React.memo(SummaryHeader);

const styles = StyleSheet.create({
  card: {
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    alignItems: 'center',
    backgroundColor: Colors.green07,
    borderRadius: ScaleSize(16),
    flexDirection: 'row',
    marginHorizontal: ScaleSize(16),
    padding: ScaleSize(16),
  },
  storeName: {
    fontSize: ScaleSize(13),
    color: Colors.black,
    // fontWeight: 'bold',
  },
  date: {
    color: Colors.gray14,
    fontSize: ScaleSize(13),
    marginTop: ScaleSize(4),
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: Colors.green05,
    borderRadius: ScaleSize(28),
    height: ScaleSize(56),
    justifyContent: 'center',
    marginRight: ScaleSize(14),
    width: ScaleSize(56),
  },
  textCol: {
    flex: 1,
  },
  amount: {
    color: Colors.black01,
    fontSize: ScaleSize(32),
    fontWeight: '700',
  },
  title: {
    color: Colors.black01,
    fontSize: ScaleSize(14),
    fontWeight: '700',
  },
});
