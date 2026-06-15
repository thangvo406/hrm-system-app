import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { ScaleSize } from '@kits/core';
import Image from '@components/Image';

const CHECK_ICON_SIZE = ScaleSize(22);
const CHECK_COLOR = '#5BB85C';
const TEXT_COLOR = '#1A1A1A';

const NOOP = (): void => undefined;

export type SelectionItem = {
  readonly id: string;
  readonly label: string;
};

type SelectionProps = {
  readonly items: readonly SelectionItem[];
  readonly onRequestClose?: () => void;
  readonly onSelect: (id: string) => void;
  readonly selectedId?: string;
  readonly title?: string;
};

function Selection({
  items,
  onRequestClose = NOOP,
  onSelect,
  selectedId = undefined,
  title = undefined,
}: SelectionProps) {
  const handlePick = (id: string) => {
    onSelect(id);
    onRequestClose();
  };

  return (
    <View style={styles.container} testID="selection-dialog">
      {title === undefined ? undefined : (
        <Text style={styles.title}>{title}</Text>
      )}
      <View style={styles.list}>
        {items.map(item => {
          const isSelected = item.id === selectedId;
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              key={item.id}
              onPress={() => {
                handlePick(item.id);
              }}
              style={styles.option}
              testID={`selection-option-${item.id}`}
            >
              <Text style={styles.optionLabel}>{item.label}</Text>
              {isSelected ? (
                <Image
                  color={CHECK_COLOR}
                  height={CHECK_ICON_SIZE}
                  name="ic_check"
                  type="svg"
                  width={CHECK_ICON_SIZE}
                />
              ) : undefined}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  list: {
    gap: ScaleSize(8),
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: ScaleSize(12),
  },
  optionLabel: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(16),
  },
  title: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(18),
    fontWeight: '700',
    marginBottom: ScaleSize(16),
    textAlign: 'center',
  },
});

export default React.memo(Selection);
