import imageNames from '@assets/images/names';
import { Button, Image } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, StyleSheet, Text, View } from 'react-native';

const ILLUSTRATION_SIZE = ScaleSize(136);

type Properties = {
  readonly desc?: string;
};

/**
 * Blocking update dialog rendered as a Dialog `screen`. The host draws the
 * white rounded card; this component lays out the illustration, the copy and
 * the two actions. Show it non-cancelable — the only ways out are updating
 * the app or quitting it.
 *
 * `desc` lets the remote app-config override the body copy for a specific
 * release; it falls back to the translated default.
 */
function ForceUpdateApp({ desc }: Properties) {
  const { t } = useTranslation();

  const onUpdate = () => {};

  return (
    <View style={styles.container} testID="force-update-dialog">
      <Image
        height={ILLUSTRATION_SIZE}
        name={imageNames.ic_device_force_update}
        style={styles.illustration}
        width={ILLUSTRATION_SIZE}
      />
      <Text style={styles.title}>{t('force_update.title')}</Text>
      <Text style={styles.subtitle}>{t('force_update.subtitle')}</Text>
      <Text style={styles.desc}>{desc || t('force_update.desc')}</Text>
      <Button
        onPress={onUpdate}
        style={styles.updateButton}
        testID="force-update-confirm"
        title={t('force_update.update_button')}
        type="rounded"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
  },
  desc: {
    color: Colors.gray23,
    fontSize: ScaleSize(14),
    lineHeight: ScaleSize(22),
    marginTop: ScaleSize(20),
    textAlign: 'center',
  },
  exitButton: {
    alignItems: 'center',
    height: ScaleSize(44),
    justifyContent: 'center',
    width: '100%',
  },
  exitLabel: {
    color: Colors.green01,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
  illustration: {
    alignSelf: 'center',
  },
  subtitle: {
    color: Colors.gray06,
    fontSize: ScaleSize(13),
    lineHeight: ScaleSize(20),
    marginTop: ScaleSize(8),
    textAlign: 'center',
  },
  title: {
    color: Colors.black01,
    fontSize: ScaleSize(20),
    fontWeight: '700',
    marginTop: ScaleSize(16),
    textAlign: 'center',
  },
  updateButton: {
    backgroundColor: Colors.green01,
    marginTop: ScaleSize(28),
    shadowColor: Colors.green01,
  },
});

export default React.memo(ForceUpdateApp);
