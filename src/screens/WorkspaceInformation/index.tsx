import InfoCard from './InfoCard';
import WorkspaceInformationHeader from './WorkspaceInformationHeader';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useWorkspaceInformation } from '@hooks';

/**
 * Màn Thông tin công việc: chỗ của nhân viên trong công ty, rồi tới hợp đồng
 * đang áp dụng. Cả màn chỉ đọc, không có hành động nào.
 */
function WorkspaceInformation() {
  const { cards, onGoBack } = useWorkspaceInformation();

  return (
    <View style={styles.container} testID="WorkspaceInformationScreen">
      <WorkspaceInformationHeader onGoBack={onGoBack} />

      <View style={styles.sheet}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {cards.map(card => (
            <InfoCard key={card.id} card={card} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

export default WorkspaceInformation;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.navy05,
    flex: 1,
  },
  content: {
    gap: ScaleSize(16),
    padding: ScaleSize(16),
    paddingBottom: ScaleSize(28),
  },
  // Tấm nền bo hai góc trên, trùm lên mép dưới dải navy đúng như thiết kế.
  sheet: {
    backgroundColor: Colors.gray28,
    borderTopLeftRadius: ScaleSize(22),
    borderTopRightRadius: ScaleSize(22),
    flex: 1,
    marginTop: -ScaleSize(16),
    overflow: 'hidden',
  },
});
