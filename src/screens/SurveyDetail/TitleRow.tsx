import type { IResponseSurveyDetail } from '@hooks';

import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import dayjs from 'dayjs';

const TEXT_DARK = '#1A1A1A';
const TEXT_DATE = '#7A7A7A';

type Properties = {
  readonly data: IResponseSurveyDetail;
};

function TitleRow({ data }: Properties) {
  const year = data.startDate ? dayjs(data.startDate).year() : undefined;
  const dateLabel = data.createdDate
    ? dayjs(data.createdDate).format('YY-MM-DD')
    : '';
  const titleLabel = year ? `[${year}] ${data.name}` : data.name;
  return (
    <View style={styles.container}>
      <Text numberOfLines={1} style={styles.title}>
        {titleLabel}
      </Text>
      <Text style={styles.date}>{dateLabel}</Text>
    </View>
  );
}

export default React.memo(TitleRow);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    gap: ScaleSize(12),
    justifyContent: 'space-between',
    paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(16),
  },
  date: {
    color: TEXT_DATE,
    fontSize: ScaleSize(12),
    fontWeight: '500',
  },
  title: {
    color: TEXT_DARK,
    flexShrink: 1,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
});
