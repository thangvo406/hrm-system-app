import type { LayoutChangeEvent } from 'react-native';
import type { TSelectionItem } from '@type/dialog';

import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React, { useCallback } from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';

const CHECK_ICON_SIZE = ScaleSize(22);
const LEADING_ICON_SIZE = ScaleSize(24);
const CHECK_COLOR = '#5BB85C';

type Properties = {
  readonly isLast: boolean;
  readonly isSelected: boolean;
  readonly item: TSelectionItem;
  readonly label: string;
  readonly onMeasure?: (y: number) => void;
  readonly onPress: () => void;
};

/** Một dòng trong bộ chọn: icon tuỳ chọn, nhãn, và dấu check khi đang chọn. */
function OptionRow({
  isLast,
  isSelected,
  item,
  label,
  onMeasure,
  onPress,
}: Properties) {
  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (isSelected) {
        onMeasure?.(event.nativeEvent.layout.y);
      }
    },
    [isSelected, onMeasure],
  );

  return (
    <AppButton
      onLayout={onLayout}
      onPress={onPress}
      style={[styles.option, { borderBottomWidth: isLast ? 0 : 1 }]}
      testID={`selection-option-${item.id}`}
    >
      <View style={styles.content}>
        {item.icon === undefined ? undefined : (
          <Image
            color={Colors.primary}
            height={LEADING_ICON_SIZE}
            name={item.icon}
            type={item.iconType}
            width={LEADING_ICON_SIZE}
          />
        )}
        <Text style={styles.label}>{label}</Text>
      </View>

      <View style={styles.checkSlot}>
        {isSelected ? (
          <Image
            color={CHECK_COLOR}
            height={CHECK_ICON_SIZE}
            name="ic_check"
            type="svg"
            width={CHECK_ICON_SIZE}
          />
        ) : undefined}
      </View>
    </AppButton>
  );
}

export default React.memo(OptionRow);

const styles = StyleSheet.create({
  checkSlot: {
    height: CHECK_ICON_SIZE,
    width: CHECK_ICON_SIZE,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 1,
    gap: ScaleSize(12),
  },
  label: {
    color: Colors.black01,
    fontSize: ScaleSize(16),
  },
  option: {
    alignItems: 'center',
    borderColor: Colors.gray2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: ScaleSize(12),
  },
});
