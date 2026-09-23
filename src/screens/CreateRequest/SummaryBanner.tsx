import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { formatLeaveDays } from '@utils/requests';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { Trans, useTranslation } from 'react-i18next';

const ICON_SIZE = ScaleSize(20);

type Properties = {
  /** Số ngày còn lại của nguồn phép sau khi trừ đơn này. */
  readonly remainingDays: number;
  readonly sourceLabelKey: string;
  readonly totalDays: number;
};

/**
 * Câu tổng kết của cả form: đơn này dài bao nhiêu và còn lại bao nhiêu phép.
 * Đây là thứ duy nhất trên màn mà người dùng thật sự muốn biết trước khi gửi,
 * nên nó được đặt ngay dưới phần chọn ngày và là chỗ duy nhất dùng chữ nhấn.
 */
function SummaryBanner({
  remainingDays,
  sourceLabelKey,
  totalDays,
}: Properties) {
  const { t } = useTranslation();
  const isOverdrawn = remainingDays < 0;

  return (
    <View
      style={[styles.container, isOverdrawn && styles.containerOverdrawn]}
      testID="CreateRequestSummary"
    >
      <Image
        color={isOverdrawn ? Colors.red03 : Colors.blue02}
        height={ICON_SIZE}
        name="ic_info"
        type="svg"
        width={ICON_SIZE}
      />

      <Text style={styles.text}>
        <Trans
          components={{
            strong: (
              <Text
                style={[styles.strong, isOverdrawn && styles.strongOverdrawn]}
              />
            ),
          }}
          i18nKey={
            isOverdrawn
              ? 'create_request.summary_overdrawn'
              : 'create_request.summary'
          }
          values={{
            remaining: formatLeaveDays(Math.abs(remainingDays)),
            source: t(sourceLabelKey).toLowerCase(),
            total: formatLeaveDays(totalDays),
          }}
        />
      </Text>
    </View>
  );
}

export default React.memo(SummaryBanner);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.blue07,
    borderRadius: ScaleSize(12),
    flexDirection: 'row',
    gap: ScaleSize(10),
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(14),
  },
  containerOverdrawn: {
    backgroundColor: Colors.red02,
  },
  strong: {
    color: Colors.blue02,
    fontWeight: '700',
  },
  strongOverdrawn: {
    color: Colors.red03,
  },
  text: {
    color: Colors.navy04,
    flex: 1,
    fontSize: ScaleSize(14),
    lineHeight: ScaleSize(20),
  },
});
