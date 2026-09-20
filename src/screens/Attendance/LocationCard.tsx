import type MapView from 'react-native-maps';
import type { LocationUtils } from '@utils';
import type { RefObject } from 'react';
import type { Region } from 'react-native-maps';

import AppButton from '@components/AppButton';
import Image from '@components/Image';
import Map, { Circle, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { useTranslation } from 'react-i18next';

const MAP_HEIGHT = ScaleSize(170);
const MARKER_SIZE = ScaleSize(36);
const MARKER_ICON_SIZE = ScaleSize(18);
const STATUS_DOT_SIZE = ScaleSize(8);
const LOCATE_BUTTON_SIZE = ScaleSize(38);
const LOCATE_ICON_SIZE = ScaleSize(20);
const LOCATE_SHADOW_OFFSET = ScaleSize(2);
const LOCATE_SHADOW_OPACITY = 0.18;
const LOCATE_ELEVATION = 3;
const GEOFENCE_STROKE_WIDTH = 2;
const GEOFENCE_FILL = 'rgba(27, 95, 181, 0.10)';
const CURRENT_MARKER_SIZE = ScaleSize(18);
const CURRENT_MARKER_BORDER_WIDTH = 3;
// Marker mặc định neo ở đáy ảnh (kiểu ghim cắm xuống đất); chấm tròn phải neo
// đúng tâm, không thì nó lệch lên trên so với toạ độ thật.
const MARKER_CENTER_ANCHOR = { x: 0.5, y: 0.5 };

type Properties = {
  /** `undefined` khi chưa lấy được vị trí lần nào. */
  readonly currentCoordinates?: LocationUtils.TCoordinates;
  readonly distanceInMeters?: number;
  readonly geofenceRadius: number;
  readonly initialRegion: Region;
  readonly isInsideGeofence: boolean;
  readonly isLocating: boolean;
  readonly mapRef: RefObject<MapView | null>;
  readonly officeName: string;
  readonly onPressLocate: () => void;
};

/**
 * Thẻ bản đồ: vòng tròn bán kính được phép chấm công quanh văn phòng, kèm chip
 * tên văn phòng và khoảng cách hiện tại.
 *
 * `PROVIDER_DEFAULT` cho ra Apple Maps trên iOS và Google Maps trên Android —
 * react-native-maps chỉ có một implementation Android duy nhất dựng trên Google
 * Maps SDK. Nhờ vậy iOS không cần API key, chỉ Android mới cần.
 */
function LocationCard({
  currentCoordinates,
  distanceInMeters,
  geofenceRadius,
  initialRegion,
  isInsideGeofence,
  isLocating,
  mapRef,
  officeName,
  onPressLocate,
}: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Map
        initialRegion={initialRegion}
        provider={PROVIDER_DEFAULT}
        ref={mapRef}
        showsMyLocationButton={false}
        style={styles.map}
        testID="AttendanceMap"
        toolbarEnabled={false}
      >
        <Circle
          center={initialRegion}
          fillColor={GEOFENCE_FILL}
          radius={geofenceRadius}
          strokeColor={Colors.blue04}
          strokeWidth={GEOFENCE_STROKE_WIDTH}
        />
        <Marker coordinate={initialRegion} tracksViewChanges={false}>
          <View style={styles.marker}>
            <Image
              color={Colors.white}
              height={MARKER_ICON_SIZE}
              name="ic_home"
              type="svg"
              width={MARKER_ICON_SIZE}
            />
          </View>
        </Marker>

        {currentCoordinates ? (
          <Marker
            anchor={MARKER_CENTER_ANCHOR}
            coordinate={currentCoordinates}
            testID="AttendanceCurrentMarker"
            tracksViewChanges={false}
          >
            <View style={styles.currentMarker} />
          </Marker>
        ) : undefined}
      </Map>

      <AppButton
        disabled={isLocating}
        onPress={onPressLocate}
        style={styles.locateButton}
        testID="AttendanceLocateButton"
      >
        {isLocating ? (
          <ActivityIndicator color={Colors.blue04} size="small" />
        ) : (
          <Image
            color={Colors.blue04}
            height={LOCATE_ICON_SIZE}
            name="ic_location"
            type="svg"
            width={LOCATE_ICON_SIZE}
          />
        )}
      </AppButton>

      <View style={styles.chip}>
        <View
          style={[
            styles.statusDot,
            isInsideGeofence ? styles.statusDotInside : styles.statusDotOutside,
          ]}
        />
        <Text numberOfLines={1} style={styles.chipLabel}>
          {distanceInMeters === undefined
            ? officeName
            : t('attendance.office_distance', {
                distance: Math.round(distanceInMeters),
                office: officeName,
              })}
        </Text>
      </View>
    </View>
  );
}

export default React.memo(LocationCard);

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
    borderRadius: ScaleSize(20),
    bottom: ScaleSize(12),
    flexDirection: 'row',
    gap: ScaleSize(8),
    left: ScaleSize(12),
    maxWidth: '90%',
    paddingHorizontal: ScaleSize(12),
    paddingVertical: ScaleSize(8),
    position: 'absolute',
  },
  chipLabel: {
    color: Colors.navy04,
    flexShrink: 1,
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
  locateButton: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: LOCATE_BUTTON_SIZE / 2,
    elevation: LOCATE_ELEVATION,
    height: LOCATE_BUTTON_SIZE,
    justifyContent: 'center',
    position: 'absolute',
    right: ScaleSize(12),
    shadowColor: Colors.navy04,
    shadowOffset: { height: LOCATE_SHADOW_OFFSET, width: 0 },
    shadowOpacity: LOCATE_SHADOW_OPACITY,
    shadowRadius: ScaleSize(6),
    top: ScaleSize(12),
    width: LOCATE_BUTTON_SIZE,
  },
  container: {
    backgroundColor: Colors.gray19,
    borderRadius: ScaleSize(18),
    height: MAP_HEIGHT,
    marginHorizontal: ScaleSize(16),
    marginTop: ScaleSize(16),
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  currentMarker: {
    backgroundColor: Colors.blue02,
    borderColor: Colors.white,
    borderRadius: CURRENT_MARKER_SIZE / 2,
    borderWidth: CURRENT_MARKER_BORDER_WIDTH,
    height: CURRENT_MARKER_SIZE,
    width: CURRENT_MARKER_SIZE,
  },
  marker: {
    alignItems: 'center',
    backgroundColor: Colors.blue04,
    borderColor: Colors.white,
    borderRadius: MARKER_SIZE / 2,
    borderWidth: 3,
    height: MARKER_SIZE,
    justifyContent: 'center',
    width: MARKER_SIZE,
  },
  statusDot: {
    borderRadius: STATUS_DOT_SIZE / 2,
    height: STATUS_DOT_SIZE,
    width: STATUS_DOT_SIZE,
  },
  statusDotInside: {
    backgroundColor: Colors.green02,
  },
  statusDotOutside: {
    backgroundColor: Colors.yellow01,
  },
});
