import type { TProfileMenuSection } from '@type/profile';

import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const TILE_SIZE = ScaleSize(40);
const ICON_SIZE = ScaleSize(20);
const CHEVRON_SIZE = ScaleSize(20);
const CARD_SHADOW_OFFSET = ScaleSize(4);
const CARD_SHADOW_RADIUS = ScaleSize(10);
const CARD_SHADOW_OPACITY = 0.05;
const CARD_ELEVATION = 2;

type Properties = {
  readonly onPressItem: (id: string) => void;
  readonly section: TProfileMenuSection;
  /** Giá trị chèn vào phụ đề, ví dụ số phiên bản của mục giới thiệu. */
  readonly values?: Readonly<Record<string, string>>;
};

/** Một nhóm menu: tiêu đề ngoài thẻ, các dòng điều hướng trong thẻ. */
function MenuSection({ onPressItem, section, values }: Properties) {
  const { t } = useTranslation();

  return (
    <View>
      <Text style={styles.sectionTitle}>{t(section.titleKey)}</Text>

      <View style={styles.card}>
        {section.items.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 ? <View style={styles.divider} /> : undefined}

            <AppButton
              onPress={() => {
                onPressItem(item.id);
              }}
              style={styles.row}
              testID={`ProfileMenu_${item.id}`}
            >
              <View style={styles.tile}>
                <Image
                  color={Colors.blue02}
                  height={ICON_SIZE}
                  name={item.icon}
                  type="svg"
                  width={ICON_SIZE}
                />
              </View>

              <View style={styles.content}>
                <Text numberOfLines={1} style={styles.title}>
                  {t(item.titleKey)}
                </Text>
                <Text numberOfLines={1} style={styles.subtitle}>
                  {t(item.subtitleKey, values)}
                </Text>
              </View>

              <Image
                color={Colors.gray24}
                height={CHEVRON_SIZE}
                name="ic_chevron_right"
                type="svg"
                width={CHEVRON_SIZE}
              />
            </AppButton>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

export default React.memo(MenuSection);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(16),
    elevation: CARD_ELEVATION,
    paddingHorizontal: ScaleSize(14),
    shadowColor: Colors.navy04,
    shadowOffset: { height: CARD_SHADOW_OFFSET, width: 0 },
    shadowOpacity: CARD_SHADOW_OPACITY,
    shadowRadius: CARD_SHADOW_RADIUS,
  },
  content: {
    flex: 1,
  },
  // Vạch thụt vào cho thẳng mép chữ, không cắt ngang cả thẻ.
  divider: {
    backgroundColor: Colors.gray19,
    height: 1,
    marginLeft: TILE_SIZE + ScaleSize(12),
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(12),
    paddingVertical: ScaleSize(14),
  },
  sectionTitle: {
    color: Colors.navy04,
    fontSize: ScaleSize(17),
    fontWeight: '700',
    marginBottom: ScaleSize(10),
  },
  subtitle: {
    color: Colors.gray17,
    fontSize: ScaleSize(13),
    marginTop: ScaleSize(2),
  },
  tile: {
    alignItems: 'center',
    backgroundColor: Colors.blue07,
    borderRadius: ScaleSize(12),
    height: TILE_SIZE,
    justifyContent: 'center',
    width: TILE_SIZE,
  },
  title: {
    color: Colors.navy04,
    fontSize: ScaleSize(16),
    fontWeight: '600',
  },
});
