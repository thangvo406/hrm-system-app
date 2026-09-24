import AppButton from '@components/AppButton';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text } from 'react-native';
import { Trans } from 'react-i18next';

type Properties = {
  /** Từ khoá đang gõ; cũng là giá trị sẽ trả về khi bấm. */
  readonly keySearch: string;
  readonly onPick: () => void;
};

/**
 * Trạng thái rỗng của nhánh `emptyType === 'selection'`: cho phép dùng luôn
 * chuỗi vừa gõ làm giá trị, dành cho danh sách không liệt kê hết được (tên
 * ngân hàng).
 */
function EmptyList({ keySearch, onPick }: Properties) {
  return (
    <AppButton
      onPress={onPick}
      style={styles.container}
      testID="selection-empty-pick"
    >
      <Text>
        <Trans
          components={{ bold: <Text style={styles.keyword} /> }}
          i18nKey="common.popup.choose_bank"
          shouldUnescape
          values={{ bank: keySearch }}
        />
      </Text>
    </AppButton>
  );
}

export default React.memo(EmptyList);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: Colors.gray07,
    borderRadius: ScaleSize(10),
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: ScaleSize(20),
    paddingVertical: ScaleSize(10),
  },
  keyword: {
    fontWeight: 'bold',
  },
});
