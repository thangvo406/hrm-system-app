import type { LayoutChangeEvent } from 'react-native';
import type { PropsWithChildren } from 'react';

import Button from '@components/Button';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

/** Chừa chỗ cho nút Xác nhận đang ghim tuyệt đối ở đáy. */
const CONFIRM_RESERVED_HEIGHT = 50;

type Properties = PropsWithChildren<{
  /** Đẩy cả khối lên khi bàn phím hiện; nhánh không có ô nhập truyền 0. */
  readonly keyboardHeight?: number;
  readonly onConfirm: () => void;
  readonly onLayout?: (event: LayoutChangeEvent) => void;
  /** Khoá kích thước đã đo, để lọc danh sách không làm sheet co giãn. */
  readonly size?: { readonly height: number; readonly width: number };
  readonly title?: string;
}>;

/**
 * Khung chung của bộ chọn: tiêu đề, phần thân, và nút Xác nhận ghim đáy.
 *
 * Nút nằm ở đây chứ không ở từng nhánh vì cả hai nhánh đều chốt giá trị bằng
 * đúng một nút; chỉ có việc nó chốt cái gì là khác nhau.
 */
function SelectionShell({
  children,
  keyboardHeight = 0,
  onConfirm,
  onLayout,
  size,
  title,
}: Properties) {
  const { t } = useTranslation();

  return (
    <View
      onLayout={onLayout}
      style={[styles.container, size, { marginBottom: keyboardHeight }]}
      testID="selection-dialog"
    >
      {title === undefined ? undefined : (
        <Text style={styles.title}>{title}</Text>
      )}

      {children}

      <Button
        onPress={onConfirm}
        style={styles.confirm}
        testID="selection-confirm"
        title={t('common.confirm')}
      />
    </View>
  );
}

export default React.memo(SelectionShell);

export { CONFIRM_RESERVED_HEIGHT };

const styles = StyleSheet.create({
  // Giữ nguyên cách định vị cũ: ghim tuyệt đối ở đáy, phần thân tự chừa chỗ
  // bằng CONFIRM_RESERVED_HEIGHT. Đừng đổi sang flex trong cùng lượt refactor.
  confirm: {
    alignSelf: 'center',
    bottom: 0,
    left: 17,
    position: 'absolute',
    right: 20,
  },
  container: {
    // Co lại trong maxHeight của thẻ bottom sheet để phần thân có chiều cao
    // hữu hạn và cuộn được tới dòng cuối.
    flexShrink: 1,
    paddingHorizontal: ScaleSize(20),
    width: '100%',
  },
  title: {
    color: Colors.black01,
    fontSize: ScaleSize(18),
    fontWeight: '700',
    marginBottom: ScaleSize(16),
  },
});
