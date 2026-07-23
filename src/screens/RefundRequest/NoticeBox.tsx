import { Image } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

const ICON_SIZE = ScaleSize(18);
const NOTICE_BG = '#FFFDE7';
const NOTICE_BORDER = '#F5E3B8';
const NOTICE_ACCENT = '#F5A623';
const NOTICE_TEXT = '#8A6D3B';

function NoticeBox() {
  const { t } = useTranslation();
  const notices = [
    t('refund_request.notice_1'),
    t('refund_request.notice_2'),
    t('refund_request.notice_3'),
  ];

  return (
    <View style={styles.box}>
      <View style={styles.header}>
        <Image
          color={NOTICE_ACCENT}
          height={ICON_SIZE}
          name="ic_alert_triangle"
          type="svg"
          width={ICON_SIZE}
        />
        <Text style={styles.title}>{t('refund_request.notice_title')}</Text>
      </View>

      {notices.map(notice => (
        <View key={notice} style={styles.item}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.itemText}>{notice}</Text>
        </View>
      ))}
    </View>
  );
}

export default React.memo(NoticeBox);

const styles = StyleSheet.create({
  box: {
    backgroundColor: NOTICE_BG,
    borderColor: NOTICE_BORDER,
    borderRadius: ScaleSize(12),
    borderWidth: 1,
    gap: ScaleSize(8),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(14),
    marginTop: ScaleSize(20),
  },
  bullet: {
    color: NOTICE_TEXT,
    fontSize: ScaleSize(13),
    lineHeight: ScaleSize(19),
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(6),
    marginBottom: ScaleSize(2),
  },
  item: {
    flexDirection: 'row',
    gap: ScaleSize(6),
  },
  itemText: {
    color: NOTICE_TEXT,
    flex: 1,
    fontSize: ScaleSize(13),
    lineHeight: ScaleSize(19),
  },
  title: {
    color: NOTICE_TEXT,
    fontSize: ScaleSize(14),
    fontWeight: '700',
  },
});
