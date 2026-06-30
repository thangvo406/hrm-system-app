import { ScaleSize } from '@kits/core';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {
  BarcodeCreatorView,
  BarcodeFormat,
} from 'react-native-barcode-creator';
import AppNavigator from '@navigation/AppNavigator';

const QR_SIZE = ScaleSize(300);
const BARCODE_HEIGHT = ScaleSize(120);
const BARCODE_WIDTH = ScaleSize(300);
const CLOSE_SIZE = ScaleSize(36);
const CLOSE_COLOR = '#1A1A1A';
const LABEL_COLOR = '#666666';

type QRCodeViewerMode = 'barcode' | 'qr';

type Properties = {
  readonly mode: QRCodeViewerMode;
  readonly value: string;
};

function QRCodeViewer({ mode, value }: Properties) {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.content}>
        {mode === 'qr' ? (
          <QRCode size={QR_SIZE} value={value} />
        ) : (
          <BarcodeCreatorView
            format={BarcodeFormat.CODE128}
            value={value}
            style={{ height: BARCODE_HEIGHT, width: BARCODE_WIDTH }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

export const showQRCodeViewer = (mode: QRCodeViewerMode, value: string) => {
  AppNavigator.showDialog({
    screen: QRCodeViewer as never,
    isFullScreen: true,
    transparent: true,
    mode,
    value,
  });
};

export default React.memo(QRCodeViewer);

const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    height: CLOSE_SIZE,
    justifyContent: 'center',
    width: CLOSE_SIZE,
  },
  closeText: {
    color: CLOSE_COLOR,
    fontSize: ScaleSize(18),
    fontWeight: '700',
  },
  container: {
    alignItems: 'stretch',
    backgroundColor: '#FFFFFF',
    borderRadius: ScaleSize(16),
    marginHorizontal: ScaleSize(24),
    paddingBottom: ScaleSize(32),
    paddingHorizontal: ScaleSize(24),
    paddingTop: ScaleSize(16),
  },
  content: {
    alignItems: 'center',
    marginTop: ScaleSize(16),
  },
  fullScreen: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  valueText: {
    color: LABEL_COLOR,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(16),
    textAlign: 'center',
  },
});
