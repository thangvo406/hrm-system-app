import type { TProfileInfoSection } from '@type/profile';

import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const ICON_SIZE = ScaleSize(20);
const CARD_SHADOW_OFFSET = ScaleSize(4);
const CARD_SHADOW_RADIUS = ScaleSize(10);
const CARD_SHADOW_OPACITY = 0.05;
const CARD_ELEVATION = 2;

type Properties = {
  readonly section: TProfileInfoSection;
};

/**
 * Một nhóm trường thông tin: tiêu đề ngoài thẻ, các trường trong thẻ.
 *
 * Nhãn nằm TRÊN giá trị chứ không phải ở cột trái — địa chỉ dài tới hai dòng,
 * để giá trị ở cột phải thì chữ so le rất khó đọc. Cột icon đã đủ tạo nhịp
 * nên không cần thêm vạch ngăn giữa các dòng.
 */
function InfoSection({ section }: Properties) {
  const { t } = useTranslation();

  return (
    <View>
      <Text style={styles.sectionTitle}>{t(section.titleKey)}</Text>

      <View style={styles.card}>
        {section.fields.map(field => (
          <View key={field.id} style={styles.field}>
            <Image
              color={Colors.gray17}
              height={ICON_SIZE}
              name={field.icon}
              type="svg"
              width={ICON_SIZE}
            />

            <View style={styles.content}>
              <Text style={styles.label}>{t(field.labelKey)}</Text>
              <Text style={styles.value}>{field.value}</Text>
            </View>
          </View>
        ))}
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
    gap: ScaleSize(18),
    padding: ScaleSize(16),
    shadowColor: Colors.navy04,
    shadowOffset: { height: CARD_SHADOW_OFFSET, width: 0 },
    shadowOpacity: CARD_SHADOW_OPACITY,
    shadowRadius: CARD_SHADOW_RADIUS,
  },
  content: {
    flex: 1,
  },
  field: {
    flexDirection: 'row',
    gap: ScaleSize(12),
  },
  label: {
    color: Colors.gray18,
    fontSize: ScaleSize(13),
  },
  sectionTitle: {
    color: Colors.navy04,
    fontSize: ScaleSize(16),
    fontWeight: '700',
    marginBottom: ScaleSize(10),
  },
  value: {
    color: Colors.navy04,
    fontSize: ScaleSize(15),
    fontWeight: '600',
    lineHeight: ScaleSize(21),
    marginTop: ScaleSize(3),
  },
});
