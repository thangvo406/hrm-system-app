import { ScaleSize } from '@kits/core';
import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Image } from '@components';
import { DeviceUtils } from '@kits/core/utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import imageNames from '@assets/images/names';
import { Colors } from '@constants';

const { ifAndroid, isIPadOrTablet } = DeviceUtils;

const languages = [
  {
    icon: imageNames.ic_camera_gray,
    titleKey: 'profile.image_picker.take_photo',
    type: 'camera',
  },
  {
    icon: imageNames.ic_gallery_gray,
    titleKey: 'profile.image_picker.open_gallery',
    type: 'gallery',
  },
];

function ImagePickerPopup(props: any) {
  const { onSubmit, onRequestClose } = props || {};
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const onPressItem = (item: any) => () => {
    onRequestClose?.();
    onSubmit?.(item);
  };

  const containerStyle = useMemo(() => {
    if (isIPadOrTablet()) {
      return {
        marginHorizontal: ScaleSize(130),
        marginVertical: ScaleSize(30),
        paddingBottom: insets.bottom,
        borderRadius: ScaleSize(10),
        width: '70%',
      };
    }
    return {
      width: '100%',
      paddingBottom: insets.bottom,
    };
  }, [insets]);

  const renderItem = (item: any, index: number) => {
    const hideLineBottom = index == languages?.length - 1;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPressItem(item)}
        key={index}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: ScaleSize(20),
            marginBottom: ScaleSize(20),
            marginHorizontal: ScaleSize(15),
          }}
        >
          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <Image
              name={item.icon}
              width={ScaleSize(20)}
              height={ScaleSize(20)}
            />
            <Text style={styles.fieldName}>{t(item.titleKey)}</Text>
          </View>
        </View>
        {!hideLineBottom && <View style={styles.line} />}
      </TouchableOpacity>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[
        {
          borderTopLeftRadius: ScaleSize(10),
          borderTopRightRadius: ScaleSize(10),
          backgroundColor: 'white',
          paddingHorizontal: ScaleSize(15),
        },
        containerStyle,
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: ScaleSize(15),
        }}
      >
        <Text style={styles.title}>{t('profile.image_picker.title')}</Text>
      </View>
      {languages.map((item, index) => renderItem(item, index))}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  title: {
    color: 'black',
    fontSize: ScaleSize(24),
  },
  fieldName: {
    fontSize: ScaleSize(16),
    color: Colors.black,
    marginLeft: ScaleSize(15),
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.gray07,
  },
  lineTop: {
    width: ScaleSize(70),
    height: ScaleSize(ifAndroid(5, 3)),
    position: 'absolute',
    top: ScaleSize(6),
    alignSelf: 'center',
    borderRadius: ScaleSize(10),
    // left: '35%',
    backgroundColor: Colors.gray08,
  },
});
export default ImagePickerPopup;
