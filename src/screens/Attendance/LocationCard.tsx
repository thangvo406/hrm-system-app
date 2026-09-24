import type MapView from 'react-native-maps';
import type { RefObject } from 'react';
import type { TCurrentLocation, TOfficeInfo } from '@type/attendance';

import AppButton from '@components/AppButton';
import Image from '@components/Image';
import Map, { Circle, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { AppConstants, Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { useTranslation } from 'react-i18next';
import isNumber from 'lodash/isNumber';

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
const MARKER_CENTER_ANCHOR = { x: 0.5, y: 0.5 };

type Properties = {
  readonly currentLocation: TCurrentLocation;
  readonly distanceInMeters?: number;
  readonly geofenceRadius: number;
  readonly isInsideLocation: boolean;
  readonly mapRef: RefObject<MapView | null>;
  /** `undefined` khi chưa tải được văn phòng nào — bỏ luôn vòng geofence. */
  readonly officeInfo?: TOfficeInfo;
  readonly onPressLocate: () => void;
};

function LocationCard({
  currentLocation,
  distanceInMeters,
  geofenceRadius,
  isInsideLocation,
  mapRef,
  officeInfo,
  onPressLocate,
}: Properties) {
  const { t } = useTranslation();
  const { coordinates, isLocating } = currentLocation;

  return (
    <View style={styles.container}>
      {coordinates ? (
        <Map
          initialRegion={{
            ...coordinates,
            latitudeDelta: AppConstants.MAP_REGION_DELTA,
            longitudeDelta: AppConstants.MAP_REGION_DELTA,
          }}
          provider={PROVIDER_DEFAULT}
          ref={mapRef}
          showsMyLocationButton={false}
          style={styles.map}
          testID="AttendanceMap"
          toolbarEnabled={false}
          userInterfaceStyle="light"
        >
          {officeInfo ? (
            <>
              <Circle
                center={officeInfo.coordinates}
                fillColor={GEOFENCE_FILL}
                radius={geofenceRadius}
                strokeColor={Colors.blue04}
                strokeWidth={GEOFENCE_STROKE_WIDTH}
              />
              <Marker
                coordinate={officeInfo.coordinates}
                tracksViewChanges={false}
              >
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
            </>
          ) : undefined}

          <Marker
            anchor={MARKER_CENTER_ANCHOR}
            coordinate={coordinates}
            testID="AttendanceCurrentMarker"
            tracksViewChanges={false}
          >
            <View style={styles.currentMarker} />
          </Marker>
        </Map>
      ) : (
        <View style={styles.placeholder} testID="AttendanceMapPlaceholder">
          <Text style={styles.placeholderLabel}>
            {t(
              isLocating
                ? 'attendance.locating'
                : 'attendance.location_unavailable',
            )}
          </Text>
        </View>
      )}

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
            isInsideLocation ? styles.statusDotInside : styles.statusDotOutside,
          ]}
        />
        <View>
          <Text numberOfLines={1} style={styles.chipLabel}>
            {officeInfo?.name}
          </Text>
          <Text numberOfLines={1} style={styles.chipLabel}>
            {isNumber(distanceInMeters) &&
              t('attendance.office_distance', {
                distance: Math.round(distanceInMeters),
              })}
          </Text>
        </View>
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
    borderRadius: ScaleSize(13),
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
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ScaleSize(24),
  },
  placeholderLabel: {
    color: Colors.gray24,
    fontSize: ScaleSize(13),
    fontWeight: '600',
    textAlign: 'center',
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
