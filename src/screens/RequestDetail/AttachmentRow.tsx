import type { TRequestAttachment } from '@type/requests';

import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';

const TILE_SIZE = ScaleSize(40);
const FILE_ICON_SIZE = ScaleSize(20);
const DOWNLOAD_ICON_SIZE = ScaleSize(20);

type Properties = {
  readonly attachment: TRequestAttachment;
  readonly onDownload: (id: string) => void;
};

/** Một tệp đính kèm: ô icon đỏ, tên tệp, dung lượng và nút tải về. */
function AttachmentRow({ attachment, onDownload }: Properties) {
  return (
    <View style={styles.container}>
      <View style={styles.tile}>
        <Image
          color={Colors.red03}
          height={FILE_ICON_SIZE}
          name="ic_document"
          type="svg"
          width={FILE_ICON_SIZE}
        />
      </View>

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.name}>
          {attachment.name}
        </Text>
        <Text numberOfLines={1} style={styles.size}>
          {attachment.sizeLabel}
        </Text>
      </View>

      <AppButton
        onPress={() => {
          onDownload(attachment.id);
        }}
        testID={`RequestDetailDownload_${attachment.id}`}
      >
        <Image
          color={Colors.gray17}
          height={DOWNLOAD_ICON_SIZE}
          name="ic_download"
          type="svg"
          width={DOWNLOAD_ICON_SIZE}
        />
      </AppButton>
    </View>
  );
}

export default React.memo(AttachmentRow);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.gray28,
    borderRadius: ScaleSize(12),
    flexDirection: 'row',
    gap: ScaleSize(12),
    padding: ScaleSize(12),
  },
  content: {
    flex: 1,
  },
  name: {
    color: Colors.navy04,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
  size: {
    color: Colors.gray18,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(2),
  },
  tile: {
    alignItems: 'center',
    backgroundColor: Colors.red02,
    borderRadius: ScaleSize(10),
    height: TILE_SIZE,
    justifyContent: 'center',
    width: TILE_SIZE,
  },
});
