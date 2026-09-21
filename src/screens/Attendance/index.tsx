import AppButton from '@components/AppButton';
import AttendanceHeader from './AttendanceHeader';
import ClockCard from './ClockCard';
import GeofenceBanner from './GeofenceBanner';
import Image from '@components/Image';
import LocationCard from './LocationCard';
import QrPlaceholder from './QrPlaceholder';
import TodayLog from './TodayLog';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAttendance } from '@hooks';
import { useTranslation } from 'react-i18next';

const EXPLANATION_ICON_SIZE = ScaleSize(16);

/** Màn Chấm công: chấm bằng định vị GPS hoặc bằng mã QR. */
function Attendance() {
  const {
    checkedInAt,
    checkedOutAt,
    currentCoordinates,
    distanceInMeters,
    geofenceRadius,
    hasCheckedIn,
    hasCheckedOut,
    initialRegion,
    isInsideGeofence,
    isLocating,
    logEntries,
    mapRef,
    mode,
    officeName,
    onGoBack,
    onPressExplanation,
    onPressHistory,
    onPressLocate,
    onPunch,
    setMode,
    shift,
  } = useAttendance();
  const { t } = useTranslation();

  return (
    <View style={styles.container} testID="AttendanceScreen">
      <AttendanceHeader
        mode={mode}
        onChangeMode={setMode}
        onGoBack={onGoBack}
        onPressHistory={onPressHistory}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        {mode === 'gps' ? (
          <>
            <LocationCard
              currentCoordinates={currentCoordinates}
              distanceInMeters={distanceInMeters}
              geofenceRadius={geofenceRadius}
              initialRegion={initialRegion}
              isInsideGeofence={isInsideGeofence}
              isLocating={isLocating}
              mapRef={mapRef}
              officeName={officeName}
              onPressLocate={onPressLocate}
            />
            <GeofenceBanner isInsideGeofence={isInsideGeofence} />
          </>
        ) : (
          <QrPlaceholder />
        )}

        <ClockCard
          hasCheckedIn={hasCheckedIn}
          hasCheckedOut={hasCheckedOut}
          isInsideGeofence={isInsideGeofence}
          onPunch={onPunch}
          shift={shift}
        />

        <TodayLog
          checkedInAt={checkedInAt}
          checkedOutAt={checkedOutAt}
          entries={logEntries}
        />

        <AppButton
          onPress={onPressExplanation}
          style={styles.explanation}
          testID="AttendanceExplanation"
        >
          <Image
            color={Colors.blue04}
            height={EXPLANATION_ICON_SIZE}
            name="ic_info"
            type="svg"
            width={EXPLANATION_ICON_SIZE}
          />
          <Text style={styles.explanationLabel}>
            {t('attendance.explanation_prompt')}
          </Text>
        </AppButton>
      </ScrollView>
    </View>
  );
}

export default Attendance;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray21,
    flex: 1,
  },
  content: {
    paddingBottom: ScaleSize(24),
  },
  explanation: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: ScaleSize(8),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(16),
  },
  explanationLabel: {
    color: Colors.blue04,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
});
