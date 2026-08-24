import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const PERCENT_MAX = 100;

type Properties = {
  readonly isInstalling: boolean;
  readonly progress: number;
};

function UpdateProgressView({ isInstalling, progress }: Properties) {
  const { t } = useTranslation();
  const clampedProgress = Math.min(Math.max(progress, 0), PERCENT_MAX);

  // Download qua mạng nội bộ có thể xong trước khi callback progress kịp fire
  // lần nào. Thanh 0% đứng im trông như màn hình bị lỗi, nên lúc đó (và trong
  // suốt bước install) chỉ hiện spinner thay vì một thanh rỗng.
  const hasProgress = !isInstalling && clampedProgress > 0;

  return (
    <View style={styles.container} testID="update-progress-view">
      <ActivityIndicator color={Colors.primary} size="large" />
      <Text style={styles.title}>
        {isInstalling
          ? t('code_push.installing_title')
          : t('code_push.updating_title')}
      </Text>
      <Text style={styles.description}>
        {t('code_push.updating_description')}
      </Text>
      {hasProgress ? (
        <>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${clampedProgress}%` }]} />
          </View>
          <Text style={styles.percent} testID="update-progress-percent">
            {`${clampedProgress}%`}
          </Text>
        </>
      ) : undefined}
    </View>
  );
}

export default React.memo(UpdateProgressView);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: ScaleSize(32),
  },
  description: {
    color: Colors.gray1,
    fontSize: ScaleSize(14),
    marginTop: ScaleSize(8),
    textAlign: 'center',
  },
  fill: {
    backgroundColor: Colors.primary,
    borderRadius: ScaleSize(3),
    height: '100%',
  },
  percent: {
    color: Colors.gray1,
    fontSize: ScaleSize(13),
    marginTop: ScaleSize(8),
  },
  title: {
    color: Colors.black,
    fontSize: ScaleSize(16),
    fontWeight: '600',
    marginTop: ScaleSize(20),
    textAlign: 'center',
  },
  track: {
    backgroundColor: Colors.gray3,
    borderRadius: ScaleSize(3),
    height: ScaleSize(6),
    marginTop: ScaleSize(24),
    overflow: 'hidden',
    width: '100%',
  },
});
