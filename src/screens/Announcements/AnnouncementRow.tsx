import type { AnnouncementItem } from '@hooks';

import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import dayjs from 'dayjs';

const TEXT_DARK = '#1A1A1A';
const TEXT_DATE = '#9E9E9E';

type Properties = {
  readonly item: AnnouncementItem;
  readonly onPress: (item: AnnouncementItem) => void;
};

function AnnouncementRow({ item, onPress }: Properties) {
  const handlePress = () => {
    onPress(item);
  };
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={styles.row}
      testID={`announcement-${item.id}`}
    >
      <Text numberOfLines={1} style={styles.rowTitle}>
        {item.title}
      </Text>
      <Text style={styles.rowDate}>
        {dayjs(item.createdDate).format('YY-MM-DD')}
      </Text>
    </TouchableOpacity>
  );
}

export default React.memo(AnnouncementRow);

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(10),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(14),
  },
  rowDate: {
    color: TEXT_DATE,
    fontSize: ScaleSize(12),
  },
  rowTitle: {
    color: TEXT_DARK,
    flex: 1,
    fontSize: ScaleSize(13),
    fontWeight: '500',
  },
});