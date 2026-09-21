import FilterChips from './FilterChips';
import HistoriesHeader from './HistoriesHeader';
import HistoryRow from './HistoryRow';
import MonthSelector from './MonthSelector';
import { Colors } from '@constants';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ScaleSize } from '@kits/core';
import { useAttendanceHistories } from '@hooks';
import { useTranslation } from 'react-i18next';

/** Màn Lịch sử chấm công: dải tuần, bộ lọc và danh sách ngày công. */
function AttendanceHistories() {
  const {
    entries,
    filter,
    onGoBack,
    onPickMonth,
    onPressNextMonth,
    onPressPreviousMonth,
    setFilter,
    visibleMonth,
  } = useAttendanceHistories();
  const { t } = useTranslation();

  return (
    <View style={styles.container} testID="AttendanceHistoriesScreen">
      <HistoriesHeader onGoBack={onGoBack} onPickMonth={onPickMonth} />

      <View style={styles.sheet}>
        <FilterChips onChange={setFilter} value={filter} />

        <FlatList
          ListEmptyComponent={
            <Text style={styles.empty}>{t('attendance_histories.empty')}</Text>
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
    paddingBottom: ScaleSize(24),
  },
  empty: {
    color: Colors.gray24,
    fontSize: ScaleSize(14),
    paddingTop: ScaleSize(32),
    textAlign: 'center',
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
