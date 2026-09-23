import type { IconName } from '@assets/icons';
import type { ViewStyle } from 'react-native';

import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const ICON_SIZE = ScaleSize(20);
const CHEVRON_SIZE = ScaleSize(18);

type Properties = {
  readonly icon: IconName;
  readonly labelKey: string;
  readonly onPress: () => void;
  /** Hiện mũi tên xuống ở mép phải — dành cho ô mở danh sách chọn. */
  readonly showChevron?: boolean;
  readonly style?: ViewStyle;
  readonly testID: string;
  readonly value: string;
};

/**
 * Ô nhập dạng bấm-để-chọn: nhãn ở trên, hộp viền chứa icon và giá trị. Dùng
 * chung cho ô loại nghỉ phép và hai ô ngày.
 */
function FormField({
  icon,
  labelKey,
  onPress,
  showChevron = false,
  style,
  testID,
  value,
}: Properties) {
  const { t } = useTranslation();

  return (
    <View style={style}>
      <Text style={styles.label}>{t(labelKey)}</Text>

      <AppButton onPress={onPress} style={styles.box} testID={testID}>
        <Image
          color={Colors.blue02}
          height={ICON_SIZE}
          name={icon}
          type="svg"
          width={ICON_SIZE}
        />
        <Text numberOfLines={1} style={styles.value}>
          {value}
        </Text>
        {showChevron ? (
          <Image
            color={Colors.gray17}
            height={CHEVRON_SIZE}
            name="ic_chevron_down"
            type="svg"
            width={CHEVRON_SIZE}
          />
        ) : undefined}
      </AppButton>
    </View>
  );
}

export default React.memo(FormField);

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.gray19,
    borderRadius: ScaleSize(12),
    borderWidth: 1,
    flexDirection: 'row',
    gap: ScaleSize(10),
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(14),
  },
  label: {
    color: Colors.gray17,
    fontSize: ScaleSize(14),
    fontWeight: '600',
    marginBottom: ScaleSize(8),
  },
  value: {
    color: Colors.navy04,
    flex: 1,
    fontSize: ScaleSize(15),
    fontWeight: '600',
  },
});
