import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const ICON_SIZE = ScaleSize(22);

type Properties = {
  readonly onPress: () => void;
  readonly file?: any;
};

/** Vùng đính kèm giấy tờ, viền đứt để phân biệt với các ô nhập bắt buộc. */
function AttachmentBox({ file, onPress }: Properties) {
  const { t } = useTranslation();
  return (
    <AppButton
      onPress={onPress}
      style={styles.container}
      testID="CreateRequestAttachment"
    >
      <View style={styles.row}>
        <Image
          color={Colors.gray17}
          height={ICON_SIZE}
          name="ic_paperclip"
          type="svg"
          width={ICON_SIZE}
        />
        <Text numberOfLines={1} style={styles.label}>
          {file?.name || t('create_request.attachment_label')}
        </Text>
      </View>
      {!!file && (
        <Text numberOfLines={1} style={styles.hint}>
          {t('create_request.attachment_hint')}
        </Text>
      )}
    </AppButton>
  );
}

export default React.memo(AttachmentBox);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderColor: Colors.gray15,
    borderRadius: ScaleSize(12),
    borderStyle: 'dashed',
    borderWidth: 1,
    paddingVertical: ScaleSize(18),
  },
  hint: {
    color: Colors.gray18,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(4),
  },
  label: {
    color: Colors.gray17,
    fontSize: ScaleSize(15),
    fontWeight: '600',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(8),
  },
});
