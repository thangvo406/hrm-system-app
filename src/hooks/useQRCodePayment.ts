import { showQRCodeViewer } from '@screens/Dialog/components/QRCodeViewer';

export type QRCodePaymentData = {
  readonly barcodeValue: string;
  readonly payBalance: string;
  readonly pointBalance: string;
  readonly qrValue: string;
};

const MOCK_DATA: QRCodePaymentData = {
  barcodeValue: '1234567890123456789012',
  payBalance: '100,000원',
  pointBalance: '1,000원',
  qrValue: 'https://coopuse.example.com/pay/qr/USER_12345_TOKEN',
};

const onPressScan = () => {
  // TODO: navigate to QR scanner screen
};

const onPressBarcode = () => {
  showQRCodeViewer('barcode', MOCK_DATA.barcodeValue);
};

const onPressQR = () => {
  showQRCodeViewer('qr', MOCK_DATA.qrValue);
};

export const useQRCodePayment = () => {
  return {
    ...MOCK_DATA,
    onPressBarcode,
    onPressQR,
    onPressScan,
  };
};
