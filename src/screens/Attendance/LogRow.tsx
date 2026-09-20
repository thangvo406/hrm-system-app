import type { TAttendanceLogEntry } from '@type/attendance';

import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';

const TILE_SIZE = ScaleSize(36);
const TILE_ICON_SIZE = ScaleSize(18);
const TIME_PLACEHOLDER = '--:--';

type Properties = {
  readonly entry: TAttendanceLogEntry;
};

/** Một dấu chấm công trong nhật ký hôm nay; chưa chấm thì cả dòng mờ đi. */
function LogRow({ entry }: Properties) {
  const isDone = !!entry.at;

  return (
    <View style={styles.container}>
      <View
        style={[styles.tile, isDone ? styles.tileDone : styles.tilePending]}
      >
        <Image
          color={isDone ? Colors.green08 : Colors.gray24}
          height={TILE_ICON_SIZE}
          name={entry.icon}
          type="svg"
          width={TILE_ICON_SIZE}
        />
      </View>

      <View style={styles.texts}>
        <Text style={[styles.title, !isDone && styles.mutedText]}>
          {entry.title}
        </Text>
        <Text numberOfLines={1} style={styles.place}>
          {entry.place}
        </Text>
      </View>

      <Text style={[styles.time, !isDone && styles.timePending]}>
        {entry.at ?? TIME_PLACEHOLDER}
      </Text>
    </View>
  );
}

export default React.memo(LogRow);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(12),
    paddingVertical: ScaleSize(12),
  },
  mutedText: {
    color: Colors.gray24,
  },
  place: {
    color: Colors.gray24,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(2),
  },
  texts: {
    flex: 1,
  },
  tile: {
    alignItems: 'center',
    borderRadius: ScaleSize(12),
    height: TILE_SIZE,
    justifyContent: 'center',
    width: TILE_SIZE,
  },
  tileDone: {
    backgroundColor: Colors.green06,
  },
  tilePending: {
    backgroundColor: Colors.gray21,
  },
  time: {
    color: Colors.navy04,
    fontSize: ScaleSize(17),
    fontWeight: '700',
  },
  timePending: {
    color: Colors.gray08,
    fontWeight: '600',
  },
  title: {
    color: Colors.navy04,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
});
