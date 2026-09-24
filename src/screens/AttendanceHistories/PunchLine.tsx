import type { IconName } from '@assets/icons';
import type { TAttendanceMethod } from '@type/attendance';

import Image from '@components/Image';
import React from 'react';
import { AttendanceUtils } from '@utils';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const TILE_SIZE = ScaleSize(34);
const TILE_ICON_SIZE = ScaleSize(17);
const METHOD_ICON_SIZE = ScaleSize(13);
const TIME_PLACEHOLDER = '--:--';
const TEXT_PLACEHOLDER = '--';

export type PunchTone = 'done' | 'exit' | 'missing' | 'warning';

/** Nền và màu icon của ô dấu chấm công theo tình trạng của chính dấu đó. */
const TONE_STYLES: Record<
  PunchTone,
  { readonly background: string; readonly foreground: string }
> = {
  done: { background: Colors.green06, foreground: Colors.green08 },
  exit: { background: Colors.red02, foreground: Colors.red03 },
  missing: { background: Colors.gray21, foreground: Colors.gray24 },
  warning: { background: Colors.yellow04, foreground: Colors.yellow03 },
};

type Properties = {
  /** `undefined` khi chưa chấm; dòng hiển thị mờ với `--:--`. */
  readonly at?: string;
  readonly device?: string;
  readonly icon: IconName;
  readonly label: string;
  readonly method?: TAttendanceMethod;
  readonly tone: PunchTone;
};

/** Một dấu chấm công trong dòng lịch sử: giờ, nhãn, cách chấm và thiết bị. */
function PunchLine({ at, device, icon, label, method, tone }: Properties) {
  const { t } = useTranslation();
  const toneStyle = TONE_STYLES[tone];
  const isMissing = tone === 'missing';

  /**
   * Dòng dưới ô dấu: cách chấm, kèm tên thiết bị nếu có.
   *
   * Cách chấm hiện ngay cả khi thiếu `device` — trước đây điều kiện là
   * `method && device` nên chỉ cần API không trả tên thiết bị là cả dòng rơi về
   * `--`, mất luôn thông tin GPS/QR vốn đã có.
   */
  const methodLabel = (() => {
    if (!method) {
      return TEXT_PLACEHOLDER;
    }
    const label = t(AttendanceUtils.METHOD_LABEL_KEYS[method]);
    return device
      ? t('attendance.methods.with_device', { device, method: label })
      : label;
  })();

  return (
    <View style={styles.container}>
      <View style={[styles.tile, { backgroundColor: toneStyle.background }]}>
        <Image
          color={toneStyle.foreground}
          height={TILE_ICON_SIZE}
          name={icon}
          type="svg"
          width={TILE_ICON_SIZE}
        />
      </View>

      <View style={styles.texts}>
        <View style={styles.timeRow}>
          <Text style={[styles.time, isMissing && styles.mutedText]}>
            {at ?? TIME_PLACEHOLDER}
          </Text>
          <Text numberOfLines={1} style={styles.label}>
            {label}
          </Text>
        </View>

        <View style={styles.methodRow}>
          <Image
            color={Colors.gray24}
            height={METHOD_ICON_SIZE}
            name={method ? AttendanceUtils.METHOD_ICONS[method] : 'ic_location'}
            type="svg"
            width={METHOD_ICON_SIZE}
          />
          <Text numberOfLines={1} style={styles.method}>
            {methodLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default React.memo(PunchLine);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(10),
  },
  label: {
    color: Colors.gray17,
    flexShrink: 1,
    fontSize: ScaleSize(13),
  },
  method: {
    color: Colors.gray24,
    flexShrink: 1,
    fontSize: ScaleSize(12),
  },
  methodRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(4),
    marginTop: ScaleSize(2),
  },
  mutedText: {
    color: Colors.gray08,
  },
  texts: {
    flex: 1,
  },
  tile: {
    alignItems: 'center',
    borderRadius: TILE_SIZE / 2,
    height: TILE_SIZE,
    justifyContent: 'center',
    width: TILE_SIZE,
  },
  time: {
    color: Colors.navy04,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  timeRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: ScaleSize(8),
  },
});
