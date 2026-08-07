import Image from '@components/Image';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import icLauncherRound from '@assets/images/ic_launcher_round.webp';

const BRACKET_LENGTH = ScaleSize(34);
const BRACKET_RADIUS = ScaleSize(10);
const BRACKET_THICKNESS = ScaleSize(4);
const FRAME_PADDING = ScaleSize(16);

type Properties = {
  readonly base64?: string;
  readonly size: number;
  readonly value?: string;
};

function ScanFrame({ base64, size, value }: Properties) {
  return (
    <View style={styles.frame}>
      <View style={[styles.bracket, styles.bracketTopLeft]} />
      <View style={[styles.bracket, styles.bracketTopRight]} />
      <View style={[styles.bracket, styles.bracketBottomLeft]} />
      <View style={[styles.bracket, styles.bracketBottomRight]} />

      {base64 ? (
        <Image base64={base64} height={size} width={size} />
      ) : (
        <QRCode size={size} value={value} logo={icLauncherRound} />
      )}
    </View>
  );
}

export default React.memo(ScanFrame);

const styles = StyleSheet.create({
  bracket: {
    borderColor: Colors.green02,
    height: BRACKET_LENGTH,
    position: 'absolute',
    width: BRACKET_LENGTH,
  },
  bracketBottomLeft: {
    borderBottomLeftRadius: BRACKET_RADIUS,
    borderBottomWidth: BRACKET_THICKNESS,
    borderLeftWidth: BRACKET_THICKNESS,
    bottom: 0,
    left: 0,
  },
  bracketBottomRight: {
    borderBottomRightRadius: BRACKET_RADIUS,
    borderBottomWidth: BRACKET_THICKNESS,
    borderRightWidth: BRACKET_THICKNESS,
    bottom: 0,
    right: 0,
  },
  bracketTopLeft: {
    borderLeftWidth: BRACKET_THICKNESS,
    borderTopLeftRadius: BRACKET_RADIUS,
    borderTopWidth: BRACKET_THICKNESS,
    left: 0,
    top: 0,
  },
  bracketTopRight: {
    borderRightWidth: BRACKET_THICKNESS,
    borderTopRightRadius: BRACKET_RADIUS,
    borderTopWidth: BRACKET_THICKNESS,
    right: 0,
    top: 0,
  },
  frame: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: FRAME_PADDING,
  },
});
