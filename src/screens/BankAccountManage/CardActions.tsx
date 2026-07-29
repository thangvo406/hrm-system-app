import type { IconName } from '@assets/icons';

import { AppButton, Image } from '@components';
import { ScaleSize } from '@kits/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import {
  ACCENT_INK,
  ACCENT_SURFACE,
  DANGER_INK,
  DANGER_SURFACE,
  PILL_RADIUS,
} from './tokens';

const BUTTON_HEIGHT = ScaleSize(36);
const BUTTON_MIN_WIDTH = ScaleSize(96);
const ICON_SIZE = ScaleSize(15);

function ActionButton({
  ink,
  icon,
  label,
  surface,
  testID,
  onPress,
}: {
  readonly ink: string;
  readonly icon: IconName;
  readonly label: string;
  readonly surface: string;
  readonly testID: string;
  readonly onPress?: () => void;
}) {
  return (
    <AppButton
      onPress={onPress}
      style={[styles.button, { backgroundColor: surface }]}
      testID={testID}
    >
      <Image
        color={ink}
        height={ICON_SIZE}
        name={icon}
        type="svg"
        width={ICON_SIZE}
      />
      <Text style={[styles.label, { color: ink }]}>{label}</Text>
    </AppButton>
  );
}

type Properties = {
  readonly direction?: 'column' | 'row';
  readonly testIDSuffix?: string;
  readonly onRemove?: () => void;
  readonly onSettings?: () => void;
};

function CardActions({
  direction = 'column',
  testIDSuffix = '',
  onRemove,
  onSettings,
}: Properties) {
  const { t } = useTranslation();

  return (
    <View style={direction === 'row' ? styles.rowGroup : styles.columnGroup}>
      <ActionButton
        icon="ic_settings"
        ink={ACCENT_INK}
        label={t('account_management.settings')}
        onPress={onSettings}
        surface={ACCENT_SURFACE}
        testID={`payment-method-settings${testIDSuffix}`}
      />
      <ActionButton
        icon="ic_trash"
        ink={DANGER_INK}
        label={t('account_management.remove')}
        onPress={onRemove}
        surface={DANGER_SURFACE}
        testID={`payment-method-remove${testIDSuffix}`}
      />
    </View>
  );
}

export default React.memo(CardActions);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: PILL_RADIUS,
    flexDirection: 'row',
    gap: ScaleSize(6),
    height: BUTTON_HEIGHT,
    justifyContent: 'center',
    minWidth: BUTTON_MIN_WIDTH,
    paddingHorizontal: ScaleSize(10),
  },
  columnGroup: {
    gap: ScaleSize(8),
  },
  label: {
    fontSize: ScaleSize(12),
    fontWeight: '600',
  },
  rowGroup: {
    flexDirection: 'row',
    gap: ScaleSize(8),
    justifyContent: 'flex-end',
  },
});
