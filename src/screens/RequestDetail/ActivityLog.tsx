import type { TRequestActivity } from '@type/requests';

import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';

const DOT_SIZE = ScaleSize(8);

type Properties = {
  readonly activities: readonly TRequestActivity[];
};

/** Nhật ký hoạt động của đơn, mới nhất xếp trước. */
function ActivityLog({ activities }: Properties) {
  return (
    <View style={styles.container}>
      {activities.map(activity => (
        <View key={activity.id} style={styles.row}>
          <View style={styles.dot} />

          <View style={styles.content}>
            <Text style={styles.time}>{activity.at}</Text>
            <Text style={styles.title}>{activity.title}</Text>
            <Text style={styles.note}>{activity.note}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export default React.memo(ActivityLog);

const styles = StyleSheet.create({
  container: {
    gap: ScaleSize(16),
  },
  content: {
    flex: 1,
  },
  dot: {
    backgroundColor: Colors.blue02,
    borderRadius: DOT_SIZE / 2,
    height: DOT_SIZE,
    // Nhích xuống cho ngang hàng chữ đầu tiên thay vì dính mép trên.
    marginTop: ScaleSize(5),
    width: DOT_SIZE,
  },
  note: {
    color: Colors.gray18,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(2),
  },
  row: {
    flexDirection: 'row',
    gap: ScaleSize(10),
  },
  time: {
    color: Colors.gray17,
    fontSize: ScaleSize(12),
  },
  title: {
    color: Colors.navy04,
    fontSize: ScaleSize(14),
    fontWeight: '600',
    marginTop: ScaleSize(2),
  },
});
