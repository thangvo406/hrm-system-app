import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { formatHours } from '@utils/requests';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { Trans } from 'react-i18next';

const ICON_SIZE = ScaleSize(20);

type Properties = {
  readonly totalHours: number;
};

/**
 * Câu tổng kết của các đơn tính theo giờ, đứng ở đúng chỗ mà `SummaryBanner`
 * đứng trong đơn nghỉ phép: ngay dưới phần chọn thời gian.
 *
 * Khoảng giờ không hợp lệ (kết thúc không sau bắt đầu) thì đổi sang lời nhắc
 * màu đỏ, vì đó cũng là lúc nút "Gửi đơn" bị khoá — người dùng cần biết vì sao.
 */
function HoursHint({ totalHours }: Properties) {
  const isInvalid = totalHours <= 0;

  return (
    <View
      style={[styles.container, isInvalid && styles.containerInvalid]}
      testID="CreateRequestHoursHint"
    >
      <Image
        color={isInvalid ? Colors.red03 : Colors.blue02}
        height={ICON_SIZE}
        name={isInvalid ? 'ic_warning' : 'ic_clock'}
        type="svg"
        width={ICON_SIZE}
      />

      <Text style={styles.text}>
        {isInvalid ? (
          <Trans i18nKey="create_request.hours_invalid" />
        ) : (
          <Trans
            components={{ strong: <Text style={styles.strong} /> }}
            i18nKey="create_request.hours_summary"
            values={{ total: formatHours(totalHours) }}
          />
        )}
      </Text>
    </View>
  );
}

export default React.memo(HoursHint);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.blue07,
    borderRadius: ScaleSize(12),
    flexDirection: 'row',
    gap: ScaleSize(10),
    padding: ScaleSize(14),
  },
  containerInvalid: {
    backgroundColor: Colors.red02,
  },
  strong: {
    color: Colors.blue02,
    fontWeight: '700',
  },
  text: {
    color: Colors.navy04,
    flex: 1,
    fontSize: ScaleSize(14),
    lineHeight: ScaleSize(20),
  },
});
