import { Colors } from '@constants';
import { Image } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

type Properties = {
  readonly date: string;
  readonly title: string;
};

const ICON_SIZE = 28;
const TITLE_MAX_LINES = 2;

function SummaryHeader({ date, title }: Properties) {
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
        <Text numberOfLines={TITLE_MAX_LINES} style={styles.title}>
          {title}
        </Text>
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
  title: {
    color: Colors.black01,
    fontSize: ScaleSize(18),
    fontWeight: '700',
  },
});
