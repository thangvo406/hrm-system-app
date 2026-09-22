import type { IconName } from '@assets/icons';
import type { TRequestStatus } from '@type/requests';

import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const ICON_SIZE = ScaleSize(14);

/** Nền, màu mực, icon và nhãn của từng kết luận duyệt đơn. */
const STATUS_STYLES: Record<
  TRequestStatus,
  {
    readonly background: string;
    readonly foreground: string;
    readonly icon: IconName;
    readonly labelKey: string;
  }
> = {
  approved: {
    background: Colors.green13,
    foreground: Colors.green12,
    icon: 'ic_check_circle',
    labelKey: 'requests.status_approved',
  },
  pending: {
    background: Colors.yellow06,
    foreground: Colors.yellow03,
    icon: 'ic_clock',
    labelKey: 'requests.status_pending',
  },
  rejected: {
    background: Colors.gray21,
    foreground: Colors.gray17,
    icon: 'x-circle',
    labelKey: 'requests.status_rejected',
  },
};

type Properties = {
  readonly status: TRequestStatus;
};

/** Nhãn trạng thái duyệt của một đơn, dạng icon + chữ trên nền nhạt. */
function RequestStatusBadge({ status }: Properties) {
  const { t } = useTranslation();
  const tone = STATUS_STYLES[status];

  return (
    <View style={[styles.container, { backgroundColor: tone.background }]}>
      <Image
        color={tone.foreground}
        height={ICON_SIZE}
        name={tone.icon}
        type="svg"
        width={ICON_SIZE}
      />
      <Text
        numberOfLines={1}
        style={[styles.label, { color: tone.foreground }]}
      >
        {t(tone.labelKey)}
      </Text>
    </View>
  );
}

export default React.memo(RequestStatusBadge);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: ScaleSize(20),
    flexDirection: 'row',
    gap: ScaleSize(5),
    paddingHorizontal: ScaleSize(10),
    paddingVertical: ScaleSize(5),
  },
  label: {
    fontSize: ScaleSize(12),
    fontWeight: '600',
  },
});
