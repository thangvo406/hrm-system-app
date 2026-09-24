import FilterChips from './FilterChips';
import HistoriesEmpty from './HistoriesEmpty';
import HistoriesHeader from './HistoriesHeader';
import HistoryRow from './HistoryRow';
import MonthSelector from './MonthSelector';
import { Colors } from '@constants';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { ScaleSize } from '@kits/core';
import { useAttendanceHistories } from '@hooks';

// Nạp thêm khi còn cách đáy nửa màn hình, để người dùng không thấy khoảng chờ.
const END_REACHED_THRESHOLD = 0.5;

/** Màn Lịch sử chấm công: dải tuần, bộ lọc và danh sách ngày công. */
function AttendanceHistories() {
  const {
    entries,
    filter,
    isLoading,
    isLoadingMore,
    onEndReached,
    onGoBack,
    onPickMonth,
    onPressNextMonth,
    onPressPreviousMonth,
    setFilter,
    visibleMonth,
  } = useAttendanceHistories();

  return (
    <View style={styles.container} testID="AttendanceHistoriesScreen">
      <HistoriesHeader onGoBack={onGoBack} onPickMonth={onPickMonth} />

      <View style={styles.sheet}>
        <FilterChips onChange={setFilter} value={filter} />

        <FlatList
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator color={Colors.blue04} style={styles.loading} />
            ) : (
              <HistoriesEmpty filter={filter} />
            )
          }
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator color={Colors.blue04} style={styles.loading} />
            ) : undefined
          }
          ListHeaderComponent={
            <MonthSelector
              month={visibleMonth.month}
              onPickMonth={onPickMonth}
              onPressNextMonth={onPressNextMonth}
              onPressPreviousMonth={onPressPreviousMonth}
              year={visibleMonth.year}
            />
          }
          contentContainerStyle={styles.content}
          data={entries}
          keyExtractor={entry => entry.id}
          onEndReached={onEndReached}
          onEndReachedThreshold={END_REACHED_THRESHOLD}
          renderItem={({ item }) => <HistoryRow entry={item} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

export default AttendanceHistories;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.navy05,
    flex: 1,
  },
  content: {
    // Cho content container nở hết chiều cao còn lại để `ListEmptyComponent`
    // (đang `flex: 1`) căn giữa được. Khi có dữ liệu thì nội dung cao hơn khung
    // nên `flexGrow` không ảnh hưởng gì.
    flexGrow: 1,
    paddingBottom: ScaleSize(24),
  },
  empty: {
    color: Colors.gray24,
    fontSize: ScaleSize(14),
    paddingTop: ScaleSize(32),
    textAlign: 'center',
  },
  loading: {
    paddingVertical: ScaleSize(16),
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
