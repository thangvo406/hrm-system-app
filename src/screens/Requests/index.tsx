import type { SectionListRenderItemInfo } from 'react-native';
import type { TRequestItem, TRequestSection } from '@type/requests';

import Animated from 'react-native-reanimated';
import DraftsBanner from './DraftsBanner';
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
    draftCount,
    hasLoaded,
    isDraftMode,
    isFiltered,
    isLoading,
    isLoadingMore,
    listContentStyle,
    listRef,
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
        {draftCount > 0 ? <DraftsBanner count={draftCount} /> : undefined}
        <TypeFilters onToggle={onToggleType} value={typeFilter} />

        <View style={styles.listArea}>
          <Animated.View
            pointerEvents={isLoading ? 'none' : 'auto'}
            style={[styles.listFill, contentStyle]}
          >
            <SectionList
              ListEmptyComponent={
                isLoading && !hasLoaded ? undefined : (
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
              ref={listRef}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
              scrollEventThrottle={SCROLL_EVENT_THROTTLE}
              sections={sections}
              showsVerticalScrollIndicator={false}
              stickySectionHeadersEnabled
            />
          </Animated.View>

          <Animated.View
            onLayout={onTabsLayout}
            style={[styles.tabsOverlay, tabsStyle]}
          >
            <RequestTabs
              counts={counts}
              isDraftMode={isDraftMode}
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
  tabsOverlay: {
    backgroundColor: Colors.gray21,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  sheet: {
    backgroundColor: Colors.gray21,
    borderTopLeftRadius: ScaleSize(22),
    borderTopRightRadius: ScaleSize(22),
    flex: 1,
    marginTop: -ScaleSize(16),
    overflow: 'hidden',
  },
});
