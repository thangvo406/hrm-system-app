import imageNames from '@assets/images/names';
import Button from '@components/Button';
import Image from '@components/Image';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { NOOP } from '@utils/common';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

const TITLE_COLOR = '#1A1A1A';
const RETRY_COLOR = '#3478F6';
const ILLUSTRATION_WIDTH = ScaleSize(160);
const ILLUSTRATION_HEIGHT = ScaleSize(144);

type Properties = {
  readonly onRequestClose?: () => void;
  readonly onRetry?: () => void;
};

/**
 * Network-error dialog rendered as a Dialog `screen`. The host wraps it in
 * the rounded, centered card; this component lays out the illustration,
 * title, description and the Try Again action.
 */
function NetworkError({ onRequestClose = NOOP, onRetry = NOOP }: Properties) {
  const { t } = useTranslation();

  const handleRetry = () => {
    onRetry();
    onRequestClose();
  };

  return (
    <View style={styles.container} testID="network-error-dialog">
      <Image
        height={ILLUSTRATION_HEIGHT}
        name={imageNames.ic_network_error}
        style={styles.illustration}
        width={ILLUSTRATION_WIDTH}
      />
      <Text style={styles.title}>{t('network_error.title')}</Text>
      <Text style={styles.desc}>{t('network_error.desc')}</Text>
      <Button
        onPress={handleRetry}
        style={styles.retryButton}
        testID="network-error-retry"
        title={t('network_error.retry_button')}
        type="rounded"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  desc: {
    color: Colors.gray06,
    fontSize: ScaleSize(13),
    lineHeight: ScaleSize(20),
    marginTop: ScaleSize(12),
    textAlign: 'center',
  },
  illustration: {
    alignSelf: 'center',
    marginTop: ScaleSize(8),
  },
  retryButton: {
    backgroundColor: RETRY_COLOR,
    marginTop: ScaleSize(24),
    shadowColor: RETRY_COLOR,
  },
  title: {
    color: TITLE_COLOR,
    fontSize: ScaleSize(20),
    fontWeight: '700',
    marginTop: ScaleSize(20),
    textAlign: 'center',
  },
});

export default React.memo(NetworkError);
