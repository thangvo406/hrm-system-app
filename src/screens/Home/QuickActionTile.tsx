import type { Paths } from '@navigation/paths';
import type { TQuickAction, TQuickActionTone } from '@type/home';

import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React, { useCallback } from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const BADGE_SIZE = ScaleSize(40);
const ICON_SIZE = ScaleSize(20);

const TONE_BACKGROUNDS: Record<TQuickActionTone, string> = {
  blue: Colors.blue03,
  green: Colors.green06,
  orange: Colors.yellow05,
  purple: Colors.purple02,
};

const TONE_INKS: Record<TQuickActionTone, string> = {
  blue: Colors.blue04,
  green: Colors.green08,
  orange: Colors.yellow01,
  purple: Colors.purple01,
};

type Properties = {
  readonly action: TQuickAction;
  readonly onPress: (path: Paths) => void;
};

/** Một ô tác vụ nhanh: icon trong nền màu nhạt, nhãn hai dòng bên dưới. */
function QuickActionTile({ action, onPress }: Properties) {
  const { t } = useTranslation();

  const handlePress = useCallback(() => {
    onPress(action.path);
  }, [action.path, onPress]);

  return (
    <AppButton
      onPress={handlePress}
      style={styles.container}
      testID={`HomeQuickAction-${action.icon}`}
    >
      <View
        style={[
          styles.badge,
          { backgroundColor: TONE_BACKGROUNDS[action.tone] },
        ]}
      >
        <Image
          color={TONE_INKS[action.tone]}
          height={ICON_SIZE}
          name={action.icon}
          type="svg"
          width={ICON_SIZE}
        />
      </View>
      <Text style={styles.label}>{t(action.labelKey)}</Text>
    </AppButton>
  );
}

export default React.memo(QuickActionTile);

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: ScaleSize(12),
    height: BADGE_SIZE,
    justifyContent: 'center',
    width: BADGE_SIZE,
  },
  container: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(16),
    flex: 1,
    paddingHorizontal: ScaleSize(6),
    paddingVertical: ScaleSize(14),
  },
  label: {
    color: Colors.navy04,
    fontSize: ScaleSize(12),
    fontWeight: '500',
    lineHeight: ScaleSize(16),
    marginTop: ScaleSize(8),
    textAlign: 'center',
  },
});
