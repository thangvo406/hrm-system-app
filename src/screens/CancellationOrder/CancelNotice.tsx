import { Image } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const NOTICE_ICON_SIZE = ScaleSize(20);

function CancelNotice() {
  const { t } = useTranslation();

  return (
    <View style={styles.notice}>
      <Image
        color={Colors.orange02}
        height={NOTICE_ICON_SIZE}
        name="alert-circle"
        type="svg"
        width={NOTICE_ICON_SIZE}
      />

      <View style={styles.texts}>
        <Text style={styles.title}>{t('cancellation_order.notice_title')}</Text>
        <Text style={styles.desc}>{t('cancellation_order.notice_desc')}</Text>
      </View>
    </View>
  );
}

export default React.memo(CancelNotice);

const styles = StyleSheet.create({
  desc: {
    color: Colors.gray23,
    fontSize: ScaleSize(13),
    lineHeight: ScaleSize(19),
    marginTop: ScaleSize(4),
  },
  notice: {
    backgroundColor: Colors.yellow05,
    borderColor: Colors.orange01,
    borderRadius: ScaleSize(14),
    borderWidth: ScaleSize(1),
    flexDirection: 'row',
    padding: ScaleSize(14),
  },
  texts: {
    flex: 1,
    marginLeft: ScaleSize(10),
  },
  title: {
    color: Colors.orange02,
    fontSize: ScaleSize(13),
    fontWeight: '700',
  },
});
