import type { TProfileInfoSection } from '@type/profile';

import InfoFields from '@components/InfoFields';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const CARD_SHADOW_OFFSET = ScaleSize(4);
const CARD_SHADOW_RADIUS = ScaleSize(10);
const CARD_SHADOW_OPACITY = 0.05;
const CARD_ELEVATION = 2;

type Properties = {
  readonly section: TProfileInfoSection;
};

/** Một nhóm trường thông tin: tiêu đề ngoài thẻ, các trường trong thẻ. */
function InfoSection({ section }: Properties) {
  const { t } = useTranslation();

  return (
    <View>
      <Text style={styles.sectionTitle}>{t(section.titleKey)}</Text>

      <View style={styles.card}>
        <InfoFields fields={section.fields} />
      </View>
    </View>
  );
}

export default React.memo(InfoSection);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(16),
    elevation: CARD_ELEVATION,
    padding: ScaleSize(16),
    shadowColor: Colors.navy04,
    shadowOffset: { height: CARD_SHADOW_OFFSET, width: 0 },
    shadowOpacity: CARD_SHADOW_OPACITY,
    shadowRadius: CARD_SHADOW_RADIUS,
  },
  sectionTitle: {
    color: Colors.navy04,
    fontSize: ScaleSize(16),
    fontWeight: '700',
    marginBottom: ScaleSize(10),
  },
});
