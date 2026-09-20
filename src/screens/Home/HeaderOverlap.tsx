import Image from '@components/Image';
import imageNames from '@assets/images/names';
import React from 'react';
import { Colors } from '@constants';
import {
  HEADER_BACKGROUND_WIDTH,
  SHEET_CORNER_RADIUS,
  SHEET_OVERLAP,
} from './layout';
import { StyleSheet, View } from 'react-native';

type Properties = {
  /** Chiều cao header do `useHome` đo được; 0 ở lần render đầu. */
  readonly headerHeight: number;
};

/**
 * Dải navy nối tiếp header, đặt làm phần tử đầu tiên của vùng cuộn để thẻ ca
 * làm việc đè lên được (thẻ có `marginTop` âm đúng bằng chiều cao dải này).
 * Nó nằm trong vùng cuộn nên trượt lên cùng thẻ và bị cắt ở mép dưới header.
 *
 * Ảnh nền ở đây là PHẦN TIẾP THEO của đúng khung ảnh mà header đang vẽ: cùng bề
 * ngang, cùng chiều cao `headerHeight + SHEET_OVERLAP`, chỉ kéo lên
 * `-headerHeight` để lộ đoạn cuối. Nhờ vậy mép dưới header không có đường nối.
 */
function HeaderOverlap({ headerHeight }: Properties) {
  return (
    <View style={styles.container}>
      {headerHeight > 0 && (
        <Image
          height={headerHeight + SHEET_OVERLAP}
          name={imageNames.bg_home_header}
          resizeMode="cover"
          style={{ ...styles.background, top: -headerHeight }}
          width={HEADER_BACKGROUND_WIDTH}
        />
      )}
    </View>
  );
}

export default React.memo(HeaderOverlap);

const styles = StyleSheet.create({
  background: {
    left: 0,
    position: 'absolute',
  },
  container: {
    // Nền dự phòng cho khung hình đầu tiên, khi chiều cao header chưa đo xong.
    backgroundColor: Colors.navy05,
    borderBottomLeftRadius: SHEET_CORNER_RADIUS,
    borderBottomRightRadius: SHEET_CORNER_RADIUS,
    height: SHEET_OVERLAP,
    overflow: 'hidden',
  },
});
