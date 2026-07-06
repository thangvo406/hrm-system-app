import { Button } from '@components';
import RegisterHeader from './Header';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

const RESEND_COLOR = '#0A7340';

type AcademicVerificationProps = {
  readonly mailAcademic: string;
  readonly onReEnterEmailAcademic: () => void;
  readonly onResendEmailAcademic: () => void;
};

function AcademicVerification({
  mailAcademic,
  onReEnterEmailAcademic,
  onResendEmailAcademic,
}: AcademicVerificationProps) {
  return (
    <View style={styles.container}>
      <RegisterHeader />
      <View style={styles.content}>
        <Text style={styles.title}>Academic Verification</Text>
        <Text style={styles.subtitle}>
          Please verify using your institutional email.
        </Text>
        <Text style={styles.sentMessage}>
          A verification email has been sent to {mailAcademic}
        </Text>
        <Button
          onPress={onReEnterEmailAcademic}
          testID="academic-re-enter-email"
          title="Re-enter email"
          type="primary"
        />
        <View style={styles.resendRow}>
          <Text style={styles.resendLabel}>
            Didn&apos;t receive the email?{' '}
          </Text>
          <TouchableOpacity
            onPress={onResendEmailAcademic}
            testID="academic-resend"
          >
            <Text style={styles.resendLink}>Resend</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: ScaleSize(24),
    paddingTop: ScaleSize(24),
  },
  resendLabel: {
    color: '#6B7280',
    fontSize: ScaleSize(13),
  },
  resendLink: {
    color: RESEND_COLOR,
    fontSize: ScaleSize(13),
    textDecorationLine: 'underline',
  },
  resendRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: ScaleSize(30),
  },
  sentMessage: {
    color: RESEND_COLOR,
    fontSize: ScaleSize(13),
    marginBottom: ScaleSize(24),
    marginTop: ScaleSize(60),
  },
  subtitle: {
    color: '#4B5563',
    fontSize: ScaleSize(14),
    marginTop: ScaleSize(18),
  },
  title: {
    color: '#111827',
    fontSize: ScaleSize(24),
    fontWeight: '700',
  },
});

export default React.memo(AcademicVerification);
