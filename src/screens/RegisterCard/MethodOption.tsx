import type { RegisterMethod, RegisterMethodKey } from '@hooks/useRegisterCard';

import { AppButton, Image } from '@components';
import { ScaleSize } from '@kits/core';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const ICON_SIZE = ScaleSize(28);
const RADIO_SIZE = ScaleSize(24);
const PRIMARY_COLOR = '#5BB85C';
const UNSELECTED_COLOR = '#C9C9C9';

type Properties = {
  readonly method: RegisterMethod;
  readonly onSelect: (key: RegisterMethodKey) => void;
  readonly selected: boolean;
};

function MethodOption({ method, onSelect, selected }: Properties) {
  const { t } = useTranslation();

  return (
    <AppButton
      onPress={() => onSelect(method.key)}
      style={[styles.card, selected ? styles.cardSelected : styles.cardIdle]}
      testID={`register-card-option-${method.key}`}
    >
      <View style={[styles.badge, { backgroundColor: method.badgeColor }]}>
        <Image height={ICON_SIZE} name={method.icon} width={ICON_SIZE} />
      </View>

      <View style={styles.texts}>
        <Text style={styles.title}>{t(method.titleKey)}</Text>
        <Text style={styles.description}>{t(method.descriptionKey)}</Text>
      </View>

      <Image
        color={selected ? PRIMARY_COLOR : UNSELECTED_COLOR}
        height={RADIO_SIZE}
        name={selected ? 'ic_radio_selected' : 'ic_radio_unselected'}
        type="svg"
        width={RADIO_SIZE}
      />
    </AppButton>
  );
}

export default React.memo(MethodOption);

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: ScaleSize(24),
    height: ScaleSize(48),
    justifyContent: 'center',
    width: ScaleSize(48),
  },
  card: {
    alignItems: 'center',
    borderRadius: ScaleSize(16),
    borderWidth: ScaleSize(1.5),
    flexDirection: 'row',
    gap: ScaleSize(14),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(16),
  },
  cardIdle: {
    backgroundColor: '#F5F6F7',
    borderColor: '#F5F6F7',
  },
  cardSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: PRIMARY_COLOR,
  },
  description: {
    color: '#8A8A8A',
    fontSize: ScaleSize(13),
    marginTop: ScaleSize(4),
  },
  texts: {
    flex: 1,
  },
  title: {
    color: '#1A1A1A',
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
});
