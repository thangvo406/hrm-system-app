import { Button } from '@components';
import RegisterHeader from '@screens/Authorisation/components/RegisterFlow/Header';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

const RED = '#D9534F';
const CIRCLE_BG = '#F0F0F0';
const CIRCLE_SIZE = ScaleSize(150);
const X_SIZE = ScaleSize(72);
const VALUE_COLOR = '#1A1A1A';
const REASON_BG = '#FEF2F2';
const REASON_BORDER = '#FCA5A5';

type VerificationFailedProps = {
  readonly reason?: string;
  readonly title?: string;
  readonly subTitle?: string;
  readonly onBack: () => void;
  readonly onRequestClose: () => void;
};

function VerificationFailed({
  reason = 'register_flow.verify_info_failed.reason_default',
  onBack,
  title = 'register_flow.verify_info_failed.title',
  subTitle = 'register_flow.verify_info_failed.subtitle',
  onRequestClose,
}: VerificationFailedProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <RegisterHeader />

      <View style={styles.content}>
        <View style={styles.circleOuter}>
          <View style={styles.circleInner}>
            <Text style={styles.xMark}>✕</Text>
          </View>
        </View>

        <Text style={styles.title}>{t(title)}</Text>
        <Text style={styles.subtitle}>{t(subTitle)}</Text>

        <View style={styles.separator} />

        <View style={styles.reasonCard}>
          <View style={styles.reasonHeader}>
            <Text style={styles.reasonIcon}>!</Text>
            <Text style={styles.reasonLabel}>
              {t('register_flow.verify_info_failed.reason_label')}
            </Text>
          </View>
          <Text style={styles.reasonText}>{t(reason)}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerSeparator} />
        <Button
          onPress={onBack || onRequestClose}
          style={styles.nextButton}
          testID="academic-verify-failed-try-again"
          title={t('register_flow.verify_info_failed.try_again')}
          type="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  circleInner: {
    alignItems: 'center',
    backgroundColor: RED,
    borderRadius: X_SIZE / 2,
    height: X_SIZE,
    justifyContent: 'center',
    width: X_SIZE,
  },
  circleOuter: {
    alignItems: 'center',
    backgroundColor: CIRCLE_BG,
    borderRadius: CIRCLE_SIZE / 2,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    marginTop: ScaleSize(32),
    width: CIRCLE_SIZE,
  },
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: ScaleSize(24),
  },
  footer: {
    paddingBottom: ScaleSize(24),
  },
  footerSeparator: {
    backgroundColor: '#F0F0F0',
    height: ScaleSize(10),
    marginBottom: ScaleSize(24),
    width: '100%',
  },
  nextButton: {
    alignSelf: 'center',
    width: '90%',
  },
  reasonCard: {
    backgroundColor: REASON_BG,
    borderColor: REASON_BORDER,
    borderRadius: ScaleSize(12),
    borderWidth: 1,
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(14),
    width: '100%',
  },
  reasonHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: ScaleSize(8),
  },
  reasonIcon: {
    borderColor: RED,
    borderRadius: ScaleSize(10),
    borderWidth: ScaleSize(1.5),
    color: RED,
    fontSize: ScaleSize(11),
    fontWeight: '700',
    height: ScaleSize(20),
    // lineHeight: ScaleSize(18),
    marginRight: ScaleSize(6),
    textAlign: 'center',
    width: ScaleSize(20),
  },
  reasonLabel: {
    color: RED,
    fontSize: ScaleSize(12),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  reasonText: {
    color: VALUE_COLOR,
    fontSize: ScaleSize(14),
    lineHeight: ScaleSize(20),
  },
  separator: {
    backgroundColor: '#F0F0F0',
    height: ScaleSize(1),
    marginVertical: ScaleSize(28),
    width: '100%',
  },
  subtitle: {
    color: '#6B7280',
    fontSize: ScaleSize(14),
    marginTop: ScaleSize(8),
    textAlign: 'center',
  },
  title: {
    color: VALUE_COLOR,
    fontSize: ScaleSize(20),
    fontWeight: '700',
    marginTop: ScaleSize(30),
    textAlign: 'center',
  },
  xMark: {
    color: '#FFFFFF',
    fontSize: ScaleSize(32),
    fontWeight: '700',
    lineHeight: ScaleSize(40),
  },
});

export default React.memo(VerificationFailed);
