import { AppConstants } from '@constants';
import { Image } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';

const ICON_SIZE = ScaleSize(20);
const ICON_COLOR = '#9E9E9E';
const FILTER_ICON_COLOR = '#9E9E9E';
const PLACEHOLDER_COLOR = '#9E9E9E';

type Properties = {
  readonly onChangeText: (text: string) => void;
  readonly onPressFilter?: () => void;
  readonly placeholder: string;
  readonly value: string;
};

function SearchBar({
  onChangeText,
  onPressFilter = undefined,
  placeholder,
  value,
}: Properties) {
  return (
    <View style={styles.wrap}>
      <TextInput
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={PLACEHOLDER_COLOR}
        style={styles.input}
        testID="stores-search-input"
        value={value}
      />
      <Image
        color={ICON_COLOR}
        height={ICON_SIZE}
        name="ic_search"
        type="svg"
        width={ICON_SIZE}
      />
      <View style={styles.divider} />
      <TouchableOpacity
        activeOpacity={0.7}
        hitSlop={AppConstants.HISLOP_BUTTON}
        onPress={onPressFilter}
        style={styles.filterButton}
        testID="stores-search-filter"
      >
        <Image
          color={FILTER_ICON_COLOR}
          height={ICON_SIZE}
          name="ic_filter"
          type="svg"
          width={ICON_SIZE}
        />
      </TouchableOpacity>
    </View>
  );
}

export default React.memo(SearchBar);

const styles = StyleSheet.create({
  divider: {
    backgroundColor: '#E0E0E0',
    height: ScaleSize(20),
    marginHorizontal: ScaleSize(4),
    width: 1,
  },
  filterButton: {
    alignItems: 'center',
    height: ScaleSize(28),
    justifyContent: 'center',
    width: ScaleSize(28),
  },
  input: {
    color: '#1A1A1A',
    flex: 1,
    fontSize: ScaleSize(15),
    paddingVertical: 0,
  },
  wrap: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#D9D9D9',
    borderRadius: ScaleSize(8),
    borderWidth: 1,
    flexDirection: 'row',
    gap: ScaleSize(8),
    height: ScaleSize(44),
    paddingHorizontal: ScaleSize(14),
  },
});
