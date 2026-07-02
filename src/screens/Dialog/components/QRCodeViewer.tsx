import { ScaleSize } from '@kits/core';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {
  BarcodeCreatorView,
  BarcodeFormat,
} from 'react-native-barcode-creator';
import AppButton from '@components/AppButton';
import icLauncherRound from '@assets/images/ic_launcher_round.webp';

const QR_SIZE = ScaleSize(300);
const BARCODE_HEIGHT = ScaleSize(120);
const BARCODE_WIDTH = ScaleSize(300);

export type QRCodeViewerMode = 'barcode' | 'qr';

type Properties = {
  readonly mode: QRCodeViewerMode;
  readonly onRequestClose: () => void;
  readonly value: string;
};

function QRCodeViewer({ mode, value, onRequestClose }: Properties) {
  return (
    <AppButton
      activeOpacity={1}
      onPress={onRequestClose}
      style={styles.fullScreen}
      testID="qr-code-viewer"
    >
      <AppButton activeOpacity={1} style={styles.card}>
        <View style={styles.content}>
          {mode === 'qr' ? (
            <QRCode size={QR_SIZE} value={value} logo={icLauncherRound} />
          ) : (
            <BarcodeCreatorView
              background="#FFFFFF"
              foregroundColor="#000000"
              format={BarcodeFormat.CODE128}
              value={value}
              style={{ height: BARCODE_HEIGHT, width: BARCODE_WIDTH }}
            />
          )}
        </View>
      </AppButton>
    </AppButton>
  );
}

export default React.memo(QRCodeViewer);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: ScaleSize(16),
    marginHorizontal: ScaleSize(24),
    paddingHorizontal: ScaleSize(24),
    paddingVertical: ScaleSize(32),
  },
  content: {
    alignItems: 'center',
  },
  fullScreen: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
});
