import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import Image from '@components/Image';
import { ScaleSize } from '@kits/core';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const BOX_SIZE = ScaleSize(22);
const BOX_RADIUS = ScaleSize(4);
const ICON_SIZE = ScaleSize(14);
const PRIMARY_COLOR = '#5BB85C';
const UNSELECTED_COLOR = '#9E9E9E';
const TEXT_COLOR = '#1A1A1A';
const CHECK_COLOR = '#FFFFFF';

type CheckBoxProps = {
  readonly disabled?: boolean;
  readonly label?: string;
  readonly onPress?: () => void;
  readonly rightComponent?: ReactNode;
  readonly rightLabel?: string;
  readonly selected: boolean;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
};

function CheckBox({
  disabled,
  label,
  onPress,
  rightLabel,
  selected,
  style,
  testID,
  rightComponent,
}: CheckBoxProps) {
  const hasRightSide = !!rightLabel || rightComponent !== undefined;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      hitSlop={{
        bottom: 10,
        left: 10,
        right: 10,
        top: 10,
      }}
      onPress={onPress}
      style={[
        styles.container,
        style,
        { justifyContent: hasRightSide ? 'space-between' : 'flex-start' },
      ]}
      testID={testID}
    >
      <View style={styles.leftGroup}>
        <View
          style={[
            styles.box,
            {
              backgroundColor: selected ? PRIMARY_COLOR : 'transparent',
              borderColor: selected ? PRIMARY_COLOR : UNSELECTED_COLOR,
            },
          ]}
        >
          {selected ? (
            <Image
              color={CHECK_COLOR}
              height={ICON_SIZE}
              name="ic_check"
              type="svg"
              width={ICON_SIZE}
            />
          ) : undefined}
        </View>
        {label === undefined ? undefined : (
          <Text style={styles.label}>{label}</Text>
        )}
      </View>

      {!!rightLabel && (
        <Text style={[styles.label, styles.rightLabel]}>{rightLabel}</Text>
      )}
      {rightComponent}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: BOX_RADIUS,
    borderWidth: 1.5,
    flexShrink: 0,
    height: BOX_SIZE,
    justifyContent: 'center',
    width: BOX_SIZE,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(10),
  },
  label: {
    color: TEXT_COLOR,
    flexShrink: 1,
    fontSize: ScaleSize(16),
    marginLeft: ScaleSize(10),
  },
  leftGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    // Chỉ shrink, KHÔNG grow: flexGrow ở đây sẽ khiến CheckBox (width auto) tự
    // phình ra bằng toàn bộ không gian còn lại của parent row và đẩy các
    // sibling ra ngoài container.
    flexShrink: 1,
  },
  rightLabel: {
    flexShrink: 0,
  },
});

export default React.memo(CheckBox);
