import HeaderOverlap from './HeaderOverlap';
import HomeHeader from './HomeHeader';
import LeaveSummary from './LeaveSummary';
import NotificationsSection from './NotificationsSection';
import QuickActions from './QuickActions';
import ShiftCard from './ShiftCard';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useHome } from '@hooks';

function Home() {
  const {
    homeInfo,
    employee,
    greetingKey,
    headerHeight,
    onCheckOut,
    onHeaderLayout,
    onPressBalance,
    onPressNotificationCenter,
    onPressQuickAction,
    shift,
  } = useHome();

  return (
    <View style={styles.container} testID="HomeScreen">
      <HomeHeader
        employee={employee}
        greetingKey={greetingKey}
        height={headerHeight}
        onLayout={onHeaderLayout}
        onPressNotificationCenter={onPressNotificationCenter}
      />

      <ScrollView
        bounces={false}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <HeaderOverlap headerHeight={headerHeight} />
        <ShiftCard onCheckOut={onCheckOut} shift={shift} />
        <QuickActions onPressAction={onPressQuickAction} />
        <LeaveSummary data={homeInfo?.leaveSummary} onPress={onPressBalance} />
        <NotificationsSection
          notifications={homeInfo?.notifications}
          onPressSeeAll={onPressNotificationCenter}
        />
      </ScrollView>
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray21,
    flex: 1,
  },
  content: {
    paddingBottom: ScaleSize(24),
  },
  scroll: {
    flex: 1,
  },
});
