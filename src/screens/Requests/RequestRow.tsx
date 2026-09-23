import type { TRequestItem } from '@type/requests';

import AppButton from '@components/AppButton';
import dayjs from 'dayjs';
import Image from '@components/Image';
import React from 'react';
import RequestStatusBadge from './RequestStatusBadge';
import { Colors } from '@constants';
import { REQUEST_TYPE_STYLES } from './requestTypes';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const CHEVRON_SIZE = ScaleSize(20);
const CIRCLE_SIZE = ScaleSize(44);
const CLOCK_SIZE = ScaleSize(13);
const ICON_SIZE = ScaleSize(22);
const CARD_ELEVATION = 2;
const CARD_SHADOW_OFFSET = ScaleSize(6);
const CARD_SHADOW_OPACITY = 0.05;
const DATE_FORMAT = 'DD/MM/YYYY';

type Properties = {
  readonly item: TRequestItem;
  readonly onPress: (item: TRequestItem) => void;
};

/** Một đơn từ trong danh sách: loại đơn, thời gian áp dụng, lý do và trạng thái. */
function RequestRow({ item, onPress }: Properties) {
  const { t } = useTranslation();
  const tone = REQUEST_TYPE_STYLES[item.type];
  const startLabel = dayjs(item.startDate).format(DATE_FORMAT);

  let periodLabel = startLabel;
  if (item.endDate) {
    periodLabel = t('requests.period_range', {
      days: item.dayCount,
      end: dayjs(item.endDate).format(DATE_FORMAT),
      start: startLabel,
    });
  } else if (item.dayCount !== undefined) {
    periodLabel = t('requests.period_days', {
      date: startLabel,
      days: item.dayCount,
    });
  }

  return (
    <AppButton
      onPress={() => {
        onPress(item);
      }}
      style={styles.container}
      testID={`RequestRow_${item.id}`}
    >
      <View style={[styles.circle, { backgroundColor: tone.tint }]}>
        <Image
          color={tone.ink}
          height={ICON_SIZE}
          name={tone.icon}
          type="svg"
          width={ICON_SIZE}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={styles.title}>
            {t(tone.labelKey)}
          </Text>
          <RequestStatusBadge status={item.status} />
        </View>

        <Text numberOfLines={1} style={styles.period}>
          {periodLabel}
        </Text>
        <Text numberOfLines={2} style={styles.reason}>
          {t('requests.reason', { reason: item.reason })}
        </Text>

        <View style={styles.createdRow}>
          <Image
            color={Colors.gray24}
            height={CLOCK_SIZE}
            name="ic_clock"
            type="svg"
            width={CLOCK_SIZE}
          />
          <Text numberOfLines={1} style={styles.created}>
            {t('requests.created_at', {
              date: dayjs(item.createdAt).format(DATE_FORMAT),
            })}
          </Text>
        </View>
      </View>

      <Image
        color={Colors.gray24}
        height={CHEVRON_SIZE}
        name="ic_chevron_right"
        type="svg"
        width={CHEVRON_SIZE}
      />
    </AppButton>
  );
}

export default React.memo(RequestRow);

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    borderRadius: CIRCLE_SIZE / 2,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    width: CIRCLE_SIZE,
  },
  container: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(18),
    elevation: CARD_ELEVATION,
    flexDirection: 'row',
    gap: ScaleSize(12),
    marginHorizontal: ScaleSize(16),
    marginTop: ScaleSize(12),
    padding: ScaleSize(14),
    shadowColor: Colors.navy04,
    shadowOffset: { height: CARD_SHADOW_OFFSET, width: 0 },
    shadowOpacity: CARD_SHADOW_OPACITY,
    shadowRadius: ScaleSize(12),
  },
  content: {
    flex: 1,
  },
  created: {
    color: Colors.gray24,
    flexShrink: 1,
    fontSize: ScaleSize(12),
  },
  createdRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(5),
    marginTop: ScaleSize(8),
  },
  period: {
    color: Colors.gray17,
    fontSize: ScaleSize(13),
    marginTop: ScaleSize(4),
  },
  reason: {
    color: Colors.gray17,
    fontSize: ScaleSize(13),
    marginTop: ScaleSize(2),
  },
  title: {
    color: Colors.navy04,
    flexShrink: 1,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(8),
    justifyContent: 'space-between',
  },
});
