import type { TRequestStatus } from '@type/requests';

import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { REQUEST_STATUS_VIEWS } from './requestStatusViews';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const ICON_SIZE = ScaleSize(20);

type Properties = {
  readonly status: TRequestStatus;
};

/** Câu trả lời thẳng cho "đơn của tôi đang thế nào", ngay trên phần chi tiết. */
function StatusBanner({ status }: Properties) {
  const { t } = useTranslation();
  const view = REQUEST_STATUS_VIEWS[status];

  return (
    <View
      style={[styles.container, { backgroundColor: view.background }]}
      testID="RequestDetailBanner"
    >
      <Image
        color={view.foreground}
        height={ICON_SIZE}
        name={view.icon}
        type="svg"
        width={ICON_SIZE}
      />

      <View style={styles.content}>
        <Text style={[styles.title, { color: view.foreground }]}>
          {t(view.titleKey)}
        </Text>
        <Text style={styles.message}>{t(view.messageKey)}</Text>
      </View>
    </View>
  );
}

export default React.memo(StatusBanner);

const styles = StyleSheet.create({
  container: {
    borderRadius: ScaleSize(14),
    flexDirection: 'row',
    gap: ScaleSize(10),
    padding: ScaleSize(14),
  },
  content: {
    flex: 1,
  },
  message: {
    color: Colors.gray17,
    fontSize: ScaleSize(13),
    lineHeight: ScaleSize(19),
    marginTop: ScaleSize(4),
  },
  title: {
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
});
