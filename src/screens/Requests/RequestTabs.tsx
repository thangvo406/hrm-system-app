import type { TRequestTab } from '@type/requests';

import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const FILTER_ICON_SIZE = ScaleSize(22);

const TABS: readonly {
  readonly labelKey: string;
  readonly value: TRequestTab;
}[] = [
  { labelKey: 'requests.tab_all', value: 'all' },
  { labelKey: 'requests.tab_pending', value: 'pending' },
  { labelKey: 'requests.tab_processed', value: 'processed' },
];

type Properties = {
  readonly counts: Record<TRequestTab, number>;
  readonly onChange: (tab: TRequestTab) => void;
  readonly onOpenFilter: () => void;
  readonly value: TRequestTab;
};

/** Hàng tab lọc theo trạng thái duyệt, kèm nút bộ lọc nâng cao bên phải. */
function RequestTabs({ counts, onChange, onOpenFilter, value }: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        {TABS.map((tab, index) => {
          const isActive = tab.value === value;
          const hasDivider =
            index > 0 && !isActive && TABS[index - 1]?.value !== value;

          return (
            <React.Fragment key={tab.value}>
              {hasDivider ? <View style={styles.divider} /> : undefined}
              <AppButton
                onPress={() => {
                  onChange(tab.value);
                }}
                style={[styles.tab, isActive && styles.tabActive]}
                testID={`RequestsTab_${tab.value}`}
              >
                <Text
                  numberOfLines={1}
                  style={[styles.label, isActive && styles.labelActive]}
                >
                  {t(tab.labelKey, { total: counts[tab.value] })}
                </Text>
              </AppButton>
            </React.Fragment>
          );
        })}
      </View>

      <AppButton
        onPress={onOpenFilter}
        style={styles.filterButton}
        testID="RequestsFilter"
      >
        <Image
          color={Colors.gray17}
          height={FILTER_ICON_SIZE}
          name="ic_filter"
          type="svg"
          width={FILTER_ICON_SIZE}
        />
      </AppButton>
    </View>
  );
}

export default React.memo(RequestTabs);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(6),
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(16),
  },
  // Vạch ngăn mảnh giữa hai tab không được chọn, giống thiết kế.
  divider: {
    alignSelf: 'center',
    backgroundColor: Colors.gray19,
    height: ScaleSize(20),
    width: 1,
  },
  filterButton: {
    alignItems: 'center',
    height: ScaleSize(44),
    justifyContent: 'center',
    width: ScaleSize(32),
  },
  // 13pt chứ không phải 14: ba nhãn đều kèm số đếm trong ngoặc, ở máy 5.4"
  // thì 14pt đã đủ dài để "Chờ duyệt (3)" bị cắt mất đuôi.
  label: {
    color: Colors.gray17,
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
  labelActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  tab: {
    alignItems: 'center',
    borderRadius: ScaleSize(12),
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: ScaleSize(4),
    paddingVertical: ScaleSize(12),
  },
  tabActive: {
    backgroundColor: Colors.blue02,
  },
  track: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(16),
    flex: 1,
    flexDirection: 'row',
    padding: ScaleSize(4),
  },
});
