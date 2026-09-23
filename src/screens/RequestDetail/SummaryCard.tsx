import type { TRequestDetail } from '@type/requests';

import Image from '@components/Image';
import React from 'react';
import RequestStatusBadge from '@screens/Requests/RequestStatusBadge';
import { Colors } from '@constants';
import { REQUEST_TYPE_STYLES } from '@screens/Requests/requestTypes';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const TILE_SIZE = ScaleSize(44);
const ICON_SIZE = ScaleSize(22);
const CARD_SHADOW_OFFSET = ScaleSize(4);
const CARD_SHADOW_RADIUS = ScaleSize(10);
const CARD_SHADOW_OPACITY = 0.05;
const CARD_ELEVATION = 2;

type Properties = {
  readonly detail: TRequestDetail;
};

/** Thẻ đầu màn: loại đơn, mã đơn, người tạo và trạng thái hiện tại. */
function SummaryCard({ detail }: Properties) {
  const { t } = useTranslation();
  const tone = REQUEST_TYPE_STYLES[detail.type];

  return (
    <View style={styles.container}>
      <View style={[styles.tile, { backgroundColor: tone.tint }]}>
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
          <RequestStatusBadge status={detail.status} />
        </View>

        <Text numberOfLines={1} style={styles.meta}>
          {t('request_detail.code', { code: detail.code })}
        </Text>
        <Text numberOfLines={2} style={styles.meta}>
          {t('request_detail.created_by', {
            date: detail.createdAt,
            name: detail.createdBy,
          })}
        </Text>
      </View>
    </View>
  );
}

export default React.memo(SummaryCard);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(16),
    elevation: CARD_ELEVATION,
    flexDirection: 'row',
    gap: ScaleSize(12),
    padding: ScaleSize(16),
    shadowColor: Colors.navy04,
    shadowOffset: { height: CARD_SHADOW_OFFSET, width: 0 },
    shadowOpacity: CARD_SHADOW_OPACITY,
    shadowRadius: CARD_SHADOW_RADIUS,
  },
  content: {
    flex: 1,
  },
  meta: {
    color: Colors.gray17,
    fontSize: ScaleSize(13),
    marginTop: ScaleSize(4),
  },
  tile: {
    alignItems: 'center',
    borderRadius: ScaleSize(12),
    height: TILE_SIZE,
    justifyContent: 'center',
    width: TILE_SIZE,
  },
  title: {
    color: Colors.navy04,
    flexShrink: 1,
    fontSize: ScaleSize(17),
    fontWeight: '700',
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(8),
    justifyContent: 'space-between',
  },
});
