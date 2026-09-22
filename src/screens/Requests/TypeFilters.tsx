import type { TRequestType } from '@type/requests';

import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { REQUEST_TYPE_ORDER, REQUEST_TYPE_STYLES } from './requestTypes';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const CIRCLE_SIZE = ScaleSize(36);
const ICON_SIZE = ScaleSize(20);

type Properties = {
  readonly onToggle: (type: TRequestType) => void;
  /** `undefined` khi đang xem tất cả các loại đơn. */
  readonly value: TRequestType | undefined;
};

/**
 * Hàng thẻ lọc danh sách theo loại đơn. Thẻ đang chọn tô theo màu nhận diện
 * của loại đó và đảo ô icon thành nền đậm; bấm lại chính nó thì bỏ lọc.
 */
function TypeFilters({ onToggle, value }: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {REQUEST_TYPE_ORDER.map(type => {
        const tone = REQUEST_TYPE_STYLES[type];
        const isActive = type === value;

        return (
          <AppButton
            key={type}
            onPress={() => {
              onToggle(type);
            }}
            style={[
              styles.card,
              isActive && { backgroundColor: tone.tint, borderColor: tone.ink },
            ]}
            testID={`RequestsTypeFilter_${type}`}
          >
            <View
              style={[
                styles.circle,
                { backgroundColor: isActive ? tone.ink : tone.tint },
              ]}
            >
              <Image
                color={isActive ? Colors.white : tone.ink}
                height={ICON_SIZE}
                name={tone.icon}
                type="svg"
                width={ICON_SIZE}
              />
            </View>

            <Text
              numberOfLines={1}
              style={[styles.label, isActive && { color: tone.ink }]}
            >
              {t(tone.labelKey)}
            </Text>
          </AppButton>
        );
      })}
    </View>
  );
}

export default React.memo(TypeFilters);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    // Viền trong suốt ngay từ trạng thái thường: thêm viền lúc chọn mà không
    // có sẵn chỗ thì cả thẻ bị đội lên 2pt, hàng thẻ giật mỗi lần bấm.
    borderColor: 'transparent',
    borderRadius: ScaleSize(14),
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: ScaleSize(10),
  },
  circle: {
    alignItems: 'center',
    borderRadius: CIRCLE_SIZE / 2,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    marginBottom: ScaleSize(8),
    width: CIRCLE_SIZE,
  },
  container: {
    flexDirection: 'row',
    gap: ScaleSize(8),
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(16),
  },
  hint: {
    color: Colors.gray17,
    fontSize: ScaleSize(10),
    marginTop: ScaleSize(2),
  },
  label: {
    color: Colors.navy04,
    fontSize: ScaleSize(13),
    fontWeight: '700',
  },
});
