import type { TWorkspaceInfoCard } from '@type/profile';

import Image from '@components/Image';
import InfoFields from '@components/InfoFields';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const TILE_SIZE = ScaleSize(56);
const TILE_ICON_SIZE = ScaleSize(28);
const CARD_SHADOW_OFFSET = ScaleSize(4);
const CARD_SHADOW_RADIUS = ScaleSize(10);
const CARD_SHADOW_OPACITY = 0.05;
const CARD_ELEVATION = 2;

type Properties = {
  readonly card: TWorkspaceInfoCard;
};

/**
 * Một thẻ thông tin: ô biểu tượng canh giữa ở đầu, tiêu đề tuỳ chọn, rồi tới
 * các trường. Ô biểu tượng là chi tiết màu duy nhất của thẻ.
 */
function InfoCard({ card }: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.tile}>
        <Image
          color={Colors.blue02}
          height={TILE_ICON_SIZE}
          name={card.icon}
          type="svg"
          width={TILE_ICON_SIZE}
        />
      </View>

      {card.titleKey ? (
        <Text style={styles.title}>{t(card.titleKey)}</Text>
      ) : undefined}

      <InfoFields fields={card.fields} />
    </View>
  );
}

export default React.memo(InfoCard);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(16),
    elevation: CARD_ELEVATION,
    padding: ScaleSize(16),
    shadowColor: Colors.navy04,
    shadowOffset: { height: CARD_SHADOW_OFFSET, width: 0 },
    shadowOpacity: CARD_SHADOW_OPACITY,
    shadowRadius: CARD_SHADOW_RADIUS,
  },
  tile: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.blue07,
    borderRadius: ScaleSize(16),
    height: TILE_SIZE,
    justifyContent: 'center',
    marginBottom: ScaleSize(20),
    width: TILE_SIZE,
  },
  title: {
    color: Colors.navy04,
    fontSize: ScaleSize(18),
    fontWeight: '700',
    marginBottom: ScaleSize(18),
  },
});
