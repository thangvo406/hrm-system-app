import type { SectionListRenderItemInfo } from 'react-native';
import type { TRequestItem, TRequestSection } from '@type/requests';

import Animated from 'react-native-reanimated';
import MonthHeader from './MonthHeader';
import RequestRow from './RequestRow';
import RequestsEmpty from './RequestsEmpty';
import RequestsHeader from './RequestsHeader';
import RequestTabs from './RequestTabs';
import TypeFilters from './TypeFilters';
import { Colors } from '@constants';
import { ActivityIndicator, SectionList, StyleSheet, View } from 'react-native';
import { ScaleSize } from '@kits/core';
import { useCallback } from 'react';
import { useRequests } from '@hooks';

const SCROLL_EVENT_THROTTLE = 16;
const END_REACHED_THRESHOLD = 0.5;

const keyExtractor = (item: TRequestItem) => item.id;

const renderSectionHeader = ({ section }: { section: TRequestSection }) => (
  <MonthHeader month={section.month} year={section.year} />
);

/** Màn Đơn từ: thẻ tạo nhanh, tab theo trạng thái và danh sách đơn theo tháng. */
function Requests() {
  const {
    contentStyle,
    counts,
    isFiltered,
    isLoading,
    isLoadingMore,
    listContentStyle,
    onChangeTab,
    onCreateRequest,
    onEndReached,
    onOpenDetail,
    onOpenFilter,
    onScroll,
    onTabsLayout,
    onToggleType,
    sections,
    tab,
    tabsStyle,
    typeFilter,
  } = useRequests();

  // Bọc trong `useCallback`: hàm dựng dòng mà đổi tham chiếu mỗi lần render
  // thì `SectionList` phải dựng lại toàn bộ dòng đang hiện.
  const renderItem = useCallback(
    ({ item }: SectionListRenderItemInfo<TRequestItem, TRequestSection>) => (
      <RequestRow item={item} onPress={onOpenDetail} />
    ),
    [onOpenDetail],
  );

  return (
    <View style={styles.container} testID="RequestsScreen">
      <RequestsHeader onPressCreate={onCreateRequest} />

      <View style={styles.sheet}>
        <TypeFilters onToggle={onToggleType} value={typeFilter} />

        <View style={styles.listArea}>
          {/* Lớp mờ chỉ trùm danh sách, không trùm hàng tab bên dưới. */}
          <Animated.View
            // `opacity: 0` trong React Native KHÔNG chặn chạm. Không khoá lại
            // thì trong lúc nội dung đang mờ, chạm trúng một dòng không nhìn
            // thấy sẽ mở chi tiết của đơn thuộc tab cũ.
            pointerEvents={isLoading ? 'none' : 'auto'}
            style={[styles.listFill, contentStyle]}
          >
            <SectionList
              ListEmptyComponent={
                // Đang tải trang đầu thì chưa kết luận là rỗng, tránh nháy màn
                // hình rỗng rồi danh sách mới hiện ra.
                isLoading ? undefined : (
                  <RequestsEmpty
                    isFiltered={isFiltered}
                    onPressCreate={onCreateRequest}
                  />
                )
              }
              ListFooterComponent={
                isLoadingMore ? (
                  <ActivityIndicator
                    color={Colors.blue04}
                    style={styles.loading}
                  />
                ) : undefined
              }
              contentContainerStyle={[styles.content, listContentStyle]}
              keyExtractor={keyExtractor}
              onEndReached={onEndReached}
              onEndReachedThreshold={END_REACHED_THRESHOLD}
              onScroll={onScroll}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
              scrollEventThrottle={SCROLL_EVENT_THROTTLE}
              sections={sections}
              showsVerticalScrollIndicator={false}
              // Đặt tường minh: Android mặc định tắt, iOS mặc định bật.
              stickySectionHeadersEnabled
            />
          </Animated.View>

          <Animated.View
            onLayout={onTabsLayout}
            style={[styles.tabsOverlay, tabsStyle]}
          >
            <RequestTabs
              counts={counts}
              onChange={onChangeTab}
              onOpenFilter={onOpenFilter}
              value={tab}
            />
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

export default Requests;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.navy05,
    flex: 1,
  },
  content: {
    paddingBottom: ScaleSize(24),
  },
  // Xén phần hàng tab đã trượt ra khỏi mép trên, không cho nó đè lên hàng chip
  // lọc phía trên.
  listArea: {
    flex: 1,
    overflow: 'hidden',
  },
  listFill: {
    flex: 1,
  },
  loading: {
    paddingVertical: ScaleSize(16),
  },
  // Hàng tab đè lên đầu danh sách chứ không chiếm chỗ trong bố cục — có thế mới
  // trượt nó bằng `transform` mà không phải animate chiều cao. Nền đục để nội
  // dung cuộn qua bên dưới không lộ ra.
  tabsOverlay: {
    backgroundColor: Colors.gray21,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  // Tấm nền xám bo hai góc trên, trùm lên mép dưới dải navy đúng như thiết kế.
  sheet: {
    backgroundColor: Colors.gray21,
    borderTopLeftRadius: ScaleSize(22),
    borderTopRightRadius: ScaleSize(22),
    flex: 1,
    marginTop: -ScaleSize(16),
    overflow: 'hidden',
  },
});
