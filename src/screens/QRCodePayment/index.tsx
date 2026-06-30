import { AppButton, HeaderDetail, Image } from '@components';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScaleSize } from '@kits/core';
import { useQRCodePayment } from '@hooks';
import { useTranslation } from 'react-i18next';
import { Colors } from '@constants';
import QRCode from 'react-native-qrcode-svg';
import {
  BarcodeCreatorView,
  BarcodeFormat,
} from 'react-native-barcode-creator';
import imageNames from '@assets/images/names';

const CARD_RADIUS = ScaleSize(16);
const BARCODE_HEIGHT = ScaleSize(80);
const BARCODE_WIDTH = ScaleSize(280);
const QR_SIZE = ScaleSize(120);
const BUTTON_HEIGHT = ScaleSize(48);
const CARD_GREEN = Colors.primary;

function QRCodePayment() {
  const { t } = useTranslation();
  const {
    barcodeValue,
    onPressBarcode,
    onPressQR,
    onPressScan,
    payBalance,
    pointBalance,
    qrValue,
  } = useQRCodePayment();

  return (
    <View style={styles.safeArea}>
      <HeaderDetail title={t('qr_code_payment.title')} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AppButton
          onPress={onPressBarcode}
          style={styles.barcodeContainer}
          testID="qr-code-payment-barcode"
        >
          <BarcodeCreatorView
            format={BarcodeFormat.CODE128}
            value={barcodeValue}
            style={{ height: BARCODE_HEIGHT, width: BARCODE_WIDTH }}
          />
        </AppButton>

        <AppButton
          onPress={onPressQR}
          style={styles.qrContainer}
          testID="qr-code-payment-qr"
        >
          <QRCode size={QR_SIZE} value={qrValue} />
        </AppButton>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {t('qr_code_payment.card_title')}
          </Text>

          <View style={styles.cardDivider} />

          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>
              {t('qr_code_payment.pay_balance_label')}
            </Text>
            <Text style={styles.cardAmount}>{payBalance}</Text>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>
              {t('qr_code_payment.point_label')}
            </Text>
            <Text style={styles.cardAmount}>{pointBalance}</Text>
          </View>
        </View>

        <AppButton
          onPress={onPressScan}
          style={styles.scanButton}
          testID="qr-code-payment-scan"
        >
          <Image
            name={imageNames.ic_camera}
            width={ScaleSize(20)}
            height={ScaleSize(20)}
          />
          <Text style={styles.scanButtonText}>
            {t('qr_code_payment.scan_button')}
          </Text>
        </AppButton>
      </ScrollView>
    </View>
  );
}

export default QRCodePayment;

const styles = StyleSheet.create({
  barcodeContainer: {
    alignItems: 'center',
    marginTop: ScaleSize(24),
  },
  card: {
    backgroundColor: CARD_GREEN,
    borderRadius: CARD_RADIUS,
    marginHorizontal: ScaleSize(16),
    marginTop: ScaleSize(24),
    paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(20),
  },
  cardAmount: {
    color: Colors.white,
    fontSize: ScaleSize(20),
    fontWeight: '700',
  },
  cardDivider: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    height: 1,
    marginVertical: ScaleSize(16),
  },
  cardLabel: {
    color: Colors.white,
    fontSize: ScaleSize(14),
  },
  cardRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ScaleSize(8),
  },
  cardTitle: {
    color: Colors.white,
    fontSize: ScaleSize(18),
    fontWeight: '700',
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: ScaleSize(20),
  },
  safeArea: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  scanButton: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: CARD_GREEN,
    borderRadius: ScaleSize(24),
    flexDirection: 'row',
    gap: ScaleSize(8),
    height: BUTTON_HEIGHT,
    justifyContent: 'center',
    marginTop: ScaleSize(32),
    paddingHorizontal: ScaleSize(32),
  },
  scanButtonText: {
    color: Colors.white,
    fontSize: ScaleSize(16),
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: ScaleSize(40),
  },
});
