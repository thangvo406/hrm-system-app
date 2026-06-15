import { Button, Image } from '@components';
import RegisterHeader from './Header';
import imageNames from '@assets/images/names';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ScaleSize } from '@kits/core';

const TEXT_COLOR = '#1A1A1A';
const MASCOT_SIZE = ScaleSize(300);
const SEPARATOR_HEIGHT = ScaleSize(10);

type RegisterCompletedProps = {
  readonly desc: string;
  readonly disabled?: boolean;
  readonly onSubmit: () => void;
};

function RegisterCompleted({
  desc,
  disabled = false,
  onSubmit,
}: RegisterCompletedProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <RegisterHeader />

      <View style={styles.content}>
        <Image
          height={MASCOT_SIZE}
          name={imageNames.img_register_success}
          width={MASCOT_SIZE}
          resizeMode="stretch"
        />
        <Text style={styles.desc}>{desc}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerSeparator} />
        <Button
          disabled={disabled}
          onPress={onSubmit}
          style={styles.nextButton}
          testID="register-completed-next"
          title={t('register_completed.next')}
          type="primary"
        />
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
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: ScaleSize(24),
  },
  desc: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(24),
    lineHeight: ScaleSize(26),
    marginTop: ScaleSize(40),
    textAlign: 'center',
  },
  footer: {
    paddingBottom: ScaleSize(24),
  },
  footerSeparator: {
    backgroundColor: '#F0F0F0',
    height: SEPARATOR_HEIGHT,
    marginBottom: ScaleSize(24),
    width: '100%',
  },
  nextButton: {
    alignSelf: 'center',
    width: '90%',
  },
});

export default React.memo(RegisterCompleted);
