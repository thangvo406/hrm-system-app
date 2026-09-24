import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const BANNER_ICON_SIZE = ScaleSize(16);

type Properties = {
  readonly isInsideGeofence: boolean;
  readonly isMockedLocation: boolean;
};

function GeofenceBanner({ isInsideGeofence, isMockedLocation }: Properties) {
  const { t } = useTranslation();

  if (isMockedLocation) {
    return (
      <View style={[styles.container, styles.containerMocked]}>
        <Image
          color={Colors.red03}
          height={BANNER_ICON_SIZE}
          name="ic_warning"
          type="svg"
          width={BANNER_ICON_SIZE}
        />
        <Text style={[styles.label, styles.labelMocked]}>
          {t('attendance.mocked_location')}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        isInsideGeofence ? styles.containerInside : styles.containerOutside,
      ]}
    >
      <Image
        color={isInsideGeofence ? Colors.green08 : Colors.yellow03}
        height={BANNER_ICON_SIZE}
        name={isInsideGeofence ? 'ic_check' : 'ic_info'}
        type="svg"
        width={BANNER_ICON_SIZE}
      />
      <Text
        style={[
          styles.label,
          isInsideGeofence ? styles.labelInside : styles.labelOutside,
        ]}
      >
        {t(
          isInsideGeofence
            ? 'attendance.inside_geofence'
            : 'attendance.outside_geofence',
        )}
      </Text>
    </View>
  );
}

export default React.memo(GeofenceBanner);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: ScaleSize(14),
    flexDirection: 'row',
    gap: ScaleSize(10),
    marginHorizontal: ScaleSize(16),
    marginTop: ScaleSize(12),
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(12),
  },
  containerInside: {
    backgroundColor: Colors.green06,
  },
  containerMocked: {
    backgroundColor: Colors.red02,
  },
  containerOutside: {
    backgroundColor: Colors.yellow04,
  },
  label: {
    flex: 1,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
  labelInside: {
    color: Colors.green08,
  },
  labelMocked: {
    color: Colors.red03,
  },
  labelOutside: {
    color: Colors.orange02,
  },
});
