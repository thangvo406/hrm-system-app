import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import AppButton from '../AppButton';

// Quiet neutral tokens so the placeholder never competes with the real cards.
const ADD_BG = '#FCFCFD';
const ADD_BORDER = '#D6DBE1';
const ADD_TINT = '#9AA1AB';
const PLUS_SIZE = ScaleSize(20);
const PLUS_THICKNESS = ScaleSize(2);

type Properties = {
  readonly height: number;
  readonly label: string;
  readonly onPress?: () => void;
  readonly selected?: boolean;
  readonly testID?: string;
  readonly width: number;
  readonly plusStyle?: ViewStyle;
  readonly labelStyle?: TextStyle;
  readonly containerStyle?: ViewStyle;
};

function AddPlaceholder({
  height,
  label,
  onPress,
  selected = false,
  testID,
  width,
  plusStyle,
  labelStyle,
  containerStyle
}: Properties) {
  return (
    <AppButton onPress={onPress} testID={testID}>
      <View
        style={[
          styles.card,
          selected && styles.cardSelected,
          { height, width },
          containerStyle
        ]}
      >
        <View style={styles.plus}>
          <View
            style={[
              styles.plusBarHorizontal,
              selected && styles.plusBarSelected,
              plusStyle
            ]}
          />
          <View
            style={[styles.plusBarVertical, selected && styles.plusBarSelected, plusStyle]}
          />
        </View>
        <Text style={[styles.label, selected && styles.labelSelected, labelStyle]}>
          {label}
        </Text>
      </View>
    </AppButton>
  );
}

export default React.memo(AddPlaceholder);

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: ADD_BG,
    borderColor: ADD_BORDER,
    borderRadius: ScaleSize(16),
    borderStyle: 'dashed',
    borderWidth: ScaleSize(1.5),
    justifyContent: 'center',
  },
  cardSelected: {
    backgroundColor: Colors.green03,
    borderColor: Colors.green02,
    borderStyle: 'solid',
  },
  label: {
    color: ADD_TINT,
    fontSize: ScaleSize(13),
    fontWeight: '600',
    marginTop: ScaleSize(12),
  },
  labelSelected: {
    color: Colors.green01,
  },
  plus: {
    alignItems: 'center',
    height: PLUS_SIZE,
    justifyContent: 'center',
    width: PLUS_SIZE,
  },
  plusBarHorizontal: {
    backgroundColor: ADD_TINT,
    borderRadius: ScaleSize(2),
    height: PLUS_THICKNESS,
    position: 'absolute',
    width: PLUS_SIZE,
  },
  plusBarSelected: {
    backgroundColor: Colors.green02,
  },
  plusBarVertical: {
    backgroundColor: ADD_TINT,
    borderRadius: ScaleSize(2),
    height: PLUS_SIZE,
    position: 'absolute',
    width: PLUS_THICKNESS,
  },
});
