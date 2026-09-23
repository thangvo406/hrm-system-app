import type { IconName } from '@assets/icons';
import type { TLeaveBalance, TLeaveBalanceKind } from '@type/requests';

import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { formatLeaveDays } from '@utils/requests';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const CIRCLE_SIZE = ScaleSize(32);
const ICON_SIZE = ScaleSize(18);
const NO_LIMIT_PLACEHOLDER = '—';
// Bóng đổ nhẹ hơn thẻ trong danh sách đơn: ba thẻ này nằm sát nhau nên bóng
// đậm sẽ dính vào thẻ bên cạnh thành một vệt xám.
const CARD_SHADOW_OFFSET = ScaleSize(4);
const CARD_SHADOW_RADIUS = ScaleSize(8);
const CARD_SHADOW_OPACITY = 0.06;
const CARD_ELEVATION = 2;

/** Màu mực, nền ô icon và nền thẻ của từng nguồn ngày nghỉ. */
const BALANCE_STYLES: Record<
  TLeaveBalanceKind,
  {
    readonly card: string;
    readonly circle: string;
    readonly icon: IconName;
    readonly ink: string;
    readonly labelKey: string;
  }
> = {
  annual: {
    card: Colors.blue07,
    circle: Colors.blue06,
    icon: 'ic_calendar',
    ink: Colors.blue02,
    labelKey: 'create_request.balance_annual',
  },
  performance: {
    card: Colors.green14,
    circle: Colors.green13,
    icon: 'ic_star',
    ink: Colors.green12,
    labelKey: 'create_request.balance_performance',
  },
  unpaid: {
    card: Colors.purple05,
    circle: Colors.purple04,
    icon: 'ic_stack',
    ink: Colors.purple03,
    labelKey: 'create_request.balance_unpaid',
  },
};

type Properties = {
  readonly balances: readonly TLeaveBalance[];
  /** Nguồn mà đơn đang soạn sẽ trừ vào; thẻ đó được viền nổi lên. */
  readonly source: TLeaveBalanceKind;
};

/**
 * Ba thẻ số dư ở đầu màn. Viền xanh trên thẻ đang dùng không phải trang trí —
 * nó cho biết đơn này sẽ trừ vào nguồn nào.
 */
function BalanceCards({ balances, source }: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {balances.map(balance => {
        const tone = BALANCE_STYLES[balance.kind];
        const isSource = balance.kind === source;
        const hasLimit = balance.days !== undefined;

        return (
          <View
            key={balance.kind}
            style={[
              styles.card,
              { backgroundColor: tone.card },
              isSource && { borderColor: tone.ink },
            ]}
            testID={`CreateRequestBalance_${balance.kind}`}
          >
            <View style={[styles.circle, { backgroundColor: tone.circle }]}>
              <Image
                color={tone.ink}
                height={ICON_SIZE}
                name={tone.icon}
                type="svg"
                width={ICON_SIZE}
              />
            </View>

            <Text numberOfLines={2} style={styles.label}>
              {t(tone.labelKey)}
            </Text>

            <Text
              numberOfLines={1}
              style={[
                styles.value,
                { color: hasLimit ? tone.ink : Colors.gray18 },
              ]}
            >
              {hasLimit
                ? formatLeaveDays(balance.days ?? 0)
                : NO_LIMIT_PLACEHOLDER}
            </Text>

            <Text numberOfLines={2} style={styles.caption}>
              {t(
                hasLimit
                  ? 'create_request.balance_remaining'
                  : 'create_request.balance_by_policy',
              )}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default React.memo(BalanceCards);

const styles = StyleSheet.create({
  caption: {
    color: Colors.gray17,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(2),
  },
  card: {
    // Viền trong suốt sẵn từ trạng thái thường, để thẻ được chọn không đội cao
    // hơn hai thẻ còn lại.
    borderColor: 'transparent',
    borderRadius: ScaleSize(16),
    // borderWidth: ScaleSize(2),
    elevation: CARD_ELEVATION,
    flex: 1,
    paddingVertical: ScaleSize(6),
    paddingHorizontal: ScaleSize(12),
    shadowColor: Colors.navy04,
    shadowOffset: { height: CARD_SHADOW_OFFSET, width: 0 },
    shadowOpacity: CARD_SHADOW_OPACITY,
    shadowRadius: CARD_SHADOW_RADIUS,
  },
  circle: {
    alignItems: 'center',
    borderRadius: ScaleSize(10),
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    marginBottom: ScaleSize(10),
    width: CIRCLE_SIZE,
  },
  container: {
    flexDirection: 'row',
    gap: ScaleSize(10),
  },
  label: {
    color: Colors.navy04,
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
  value: {
    fontSize: ScaleSize(26),
    fontWeight: '700',
    marginTop: ScaleSize(2),
  },
});
