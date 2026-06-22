import Button from '@components/Button';
import RadioButton from '@components/RadioButton';
import { ScaleSize } from '@kits/core';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import Slider from '@react-native-community/slider';
import { Colors } from '@constants';

const sort = [
  {
    text: 'Best match',
  },
  {
    text: 'Most popular',
  },
  {
    text: 'Newly added',
  },
  {
    text: 'opening Hours',
  },
];

const PRICES = [
  {
    text: 'Tăng dần',
  },
  {
    text: 'Giảm dần',
  },
];

function Index(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter</Text>
      <Text style={styles.sectionTitle}>Sort</Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {sort.map(it => (
          <RadioButton
            label={it.text}
            key={it.text}
            style={{
              width: '50%',
              marginBottom: ScaleSize(8),
            }}
          />
        ))}
      </View>
      <Text style={styles.sectionTitle}>Price</Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginBottom: ScaleSize(20),
        }}
      >
        {PRICES.map(it => (
          <RadioButton
            label={it.text}
            key={it.text}
            style={{
              width: '50%',
              marginBottom: ScaleSize(8),
            }}
          />
        ))}
      </View>

      <Button title="Submit" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingHorizontal: ScaleSize(20),
  },
  title: {
    fontSize: ScaleSize(24),
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: ScaleSize(18),
    fontWeight: '500',
    marginTop: ScaleSize(10),
    marginBottom: ScaleSize(8),
  },
  slider: {
    height: 40,
    left: 0,
    position: 'absolute',
    right: 0,
    width: '100%',
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  sliderTrackActive: {
    backgroundColor: Colors.primary,
    borderRadius: 2,
    height: 4,
    position: 'absolute',
  },
  sliderTrackBackground: {
    backgroundColor: Colors.gray2,
    borderRadius: 2,
    height: 4,
    left: 0,
    position: 'absolute',
    right: 0,
  },
});
export default Index;
