import type { IconName } from '@assets/icons';
import type { Theme } from '../theme';

import { AppButton, Image } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { SHARED } from '../theme';

type ActionSpec = {
  readonly handlePress: () => void;
  readonly icon: IconName;
  readonly label: string;
  readonly testID?: string;
};

type SecondaryActionsProps = {
  readonly actions: readonly [ActionSpec, ActionSpec];
  readonly theme: Theme;
};

function SecondaryActions({ actions, theme }: SecondaryActionsProps) {
  return (
    <View style={styles.row}>
      {actions.map(action => (
        <AppButton
          key={action.label}
          onPress={action.handlePress}
          style={styles.btn}
          testID={action.testID}
        >
          <Image
            color={theme.accent}
            height={ScaleSize(24)}
            name={action.icon}
            type="svg"
            width={ScaleSize(24)}
          />
          <Text style={styles.label}>{action.label}</Text>
        </AppButton>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: SHARED.divider,
    borderRadius: ScaleSize(12),
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: ScaleSize(8),
    justifyContent: 'center',
    paddingVertical: ScaleSize(14),
  },
  label: {
    color: SHARED.textDark,
    fontSize: ScaleSize(13),
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    gap: ScaleSize(10),
    marginHorizontal: ScaleSize(16),
    marginTop: ScaleSize(12),
  },
});

export default React.memo(SecondaryActions);
