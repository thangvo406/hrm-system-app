import Image from '@components/Image';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const SHIELD_SIZE = ScaleSize(22);

type Properties = {
  readonly text: string;
};

/** Explains what happens when the countdown reaches zero, before it does. */
function NoticeBar({ text }: Properties) {
  return (
    <View style={styles.notice}>
      <Image
        color={Colors.green08}
        height={SHIELD_SIZE}
        name="ic_shield_check"
        type="svg"
        width={SHIELD_SIZE}
      />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

export default React.memo(NoticeBar);

const styles = StyleSheet.create({
  notice: {
    alignItems: 'center',
    backgroundColor: Colors.green06,
    borderRadius: ScaleSize(16),
    flexDirection: 'row',
    gap: ScaleSize(12),
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(14),
  },
  text: {
    color: Colors.gray23,
    flex: 1,
    fontSize: ScaleSize(13),
    fontWeight: '500',
    lineHeight: ScaleSize(19),
  },
});
