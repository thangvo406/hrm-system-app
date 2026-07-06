import { Button } from '@components';
import RegisterHeader from '@screens/Authorisation/components/RegisterFlow/Header';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colors } from '@constants';
import { useTranslation } from 'react-i18next';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { decodeUrlText } from '@utils/common';

const GREEN = '#5BB85C';
const CIRCLE_BG = '#F0F0F0';
const CIRCLE_SIZE = ScaleSize(150);
const CHECK_SIZE = ScaleSize(72);
const VALUE_COLOR = '#1A1A1A';
const BORDER_COLOR = '#E5E7EB';

type AcademicVerifyCompletedProps = {
  readonly type?: string;
  readonly school?: string;
};

const onSubmit = () => {
  AppNavigator.navigate(Paths.RegisterCompleted);
};

function AcademicVerifyCompleted({
  type = '',
  school = '',
}: AcademicVerifyCompletedProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <RegisterHeader />

      <View style={styles.content}>
        <View style={styles.circleOuter}>
          <View style={styles.circleInner}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
        </View>

        <Text style={styles.title}>
          {t('academic_verify_finish.success.title')}
        </Text>
        <Text style={styles.subtitle}>
          {t('academic_verify_finish.success.subtitle')}
        </Text>

        <View style={styles.separator} />

        <View style={styles.detailCard}>
          <Text style={styles.sectionLabel}>
            {t('academic_verify_finish.success.section_label')}
          </Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>
              {t('academic_verify_finish.success.label_school')}
            </Text>
            <Text style={styles.rowValue}>{decodeUrlText(school) ?? '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>
              {t('academic_verify_finish.success.label_type')}
            </Text>
            <Text style={styles.rowValue}>{decodeUrlText(type) ?? '-'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerSeparator} />
        <Button
          onPress={onSubmit}
          style={styles.nextButton}
          testID="academic-verfy-completed-next"
          title={t('academic_verify_finish.success.next')}
          type="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  checkMark: {
    color: '#FFFFFF',
    fontSize: ScaleSize(36),
    fontWeight: '700',
    lineHeight: ScaleSize(44),
  },
  circleInner: {
    alignItems: 'center',
    backgroundColor: GREEN,
    borderRadius: CHECK_SIZE / 2,
    height: CHECK_SIZE,
    justifyContent: 'center',
    width: CHECK_SIZE,
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
  detailCard: {
    backgroundColor: '#F5F5F5',
    borderColor: BORDER_COLOR,
    borderRadius: ScaleSize(12),
    // borderWidth: 1,
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(16),
    width: '100%',
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
  row: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    paddingVertical: ScaleSize(6),
  },
  rowLabel: {
    color: Colors.gray5,
    width: '40%',
    fontSize: ScaleSize(14),
  },
  rowValue: {
    color: VALUE_COLOR,
    fontSize: ScaleSize(14),
    fontWeight: '700',
  },
  sectionLabel: {
    color: Colors.gray5,
    fontSize: ScaleSize(11),
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: ScaleSize(8),
  },
  separator: {
    backgroundColor: '#F0F0F0',
    height: ScaleSize(1),
    marginVertical: ScaleSize(50),
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
});

export default React.memo(AcademicVerifyCompleted);
