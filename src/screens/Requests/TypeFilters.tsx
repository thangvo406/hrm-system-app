import type { TRequestType, TRequestTypeFilter } from '@type/requests';

import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { REQUEST_TYPE_ORDER, REQUEST_TYPE_STYLES } from './requestTypes';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const CIRCLE_SIZE = ScaleSize(36);
const ICON_SIZE = ScaleSize(20);

const CARD_WIDTH = ScaleSize(104);

type Properties = {
  readonly onToggle: (type: TRequestType) => void;
  readonly value: TRequestTypeFilter;
};

function TypeFilters({ onToggle, value }: Properties) {
  const { t } = useTranslation();

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {REQUEST_TYPE_ORDER.map(type => {
        const tone = REQUEST_TYPE_STYLES[type];
        const isActive = type === value;

        return (
          <AppButton
            key={type}
            onPress={() => {
              onToggle(type);
            }}
            style={[
              styles.card,
              isActive && { backgroundColor: tone.tint, borderColor: tone.ink },
            ]}
            testID={`RequestsTypeFilter_${type}`}
          >
            <View
              style={[
                styles.circle,
                { backgroundColor: isActive ? tone.ink : tone.tint },
              ]}
            >
              <Image
                color={isActive ? Colors.white : tone.ink}
                height={ICON_SIZE}
                name={tone.icon}
                type="svg"
                width={ICON_SIZE}
              />
            </View>

            <Text
              numberOfLines={2}
              style={[styles.label, isActive && { color: tone.ink }]}
            >
              {t(tone.labelKey)}
            </Text>
          </AppButton>
        );
      })}
    </ScrollView>
  );
}

export default React.memo(TypeFilters);

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: 'transparent',
    borderRadius: ScaleSize(14),
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: ScaleSize(104),
    padding: ScaleSize(10),
    width: CARD_WIDTH,
  },
  circle: {
    alignItems: 'center',
    borderRadius: CIRCLE_SIZE / 2,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    marginBottom: ScaleSize(8),
    width: CIRCLE_SIZE,
  },
  container: {
    flexGrow: 0,
    paddingTop: ScaleSize(16),
  },
  content: {
    gap: ScaleSize(8),
    paddingHorizontal: ScaleSize(16),
  },
  label: {
    color: Colors.navy04,
    fontSize: ScaleSize(13),
    fontWeight: '700',
    textAlign: 'center',
  },
});
