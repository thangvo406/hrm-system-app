import type { TQuickAction } from '@type/home';

import QuickActionTile from './QuickActionTile';
import React from 'react';
import { Paths } from '@navigation/paths';
import { ScaleSize } from '@kits/core';
import { StyleSheet, View } from 'react-native';

const QUICK_ACTIONS: readonly TQuickAction[] = [
  {
    icon: 'ic_calendar',
    labelKey: 'home.action_leave',
    path: Paths.Requests,
    tone: 'blue',
  },
  {
    icon: 'ic_clock',
    labelKey: 'home.action_overtime',
    path: Paths.Requests,
    tone: 'orange',
  },
  {
    icon: 'ic_credit_card',
    labelKey: 'home.action_payslip',
    path: Paths.Profile,
    tone: 'green',
  },
  {
    icon: 'ic_document',
    labelKey: 'home.action_explanation',
    path: Paths.Attendance,
    tone: 'purple',
  },
];

type Properties = {
  readonly onPressAction: (path: Paths) => void;
};

/** Hàng bốn tác vụ nhân viên mở nhiều nhất trong ngày. */
function QuickActions({ onPressAction }: Properties) {
  return (
    <View style={styles.container}>
      {QUICK_ACTIONS.map(action => (
        <QuickActionTile
          key={action.labelKey}
          action={action}
          onPress={onPressAction}
        />
      ))}
    </View>
  );
}

export default React.memo(QuickActions);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: ScaleSize(10),
    marginTop: ScaleSize(16),
    paddingHorizontal: ScaleSize(16),
  },
});
