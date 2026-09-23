import type { TAttachmentKind, TRequestAttachment } from '@type/requests';

import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const TILE_SIZE = ScaleSize(40);
const FILE_ICON_SIZE = ScaleSize(20);
const DOWNLOAD_ICON_SIZE = ScaleSize(20);

/** Icon, màu và nhãn viết tắt của từng loại tệp. */
const ATTACHMENT_KINDS: Record<
  TAttachmentKind,
  {
    readonly icon: 'ic_document' | 'ic_image';
    readonly ink: string;
    readonly labelKey: string;
    readonly tint: string;
  }
> = {
  image: {
    icon: 'ic_image',
    ink: Colors.blue02,
    labelKey: 'request_detail.file_image',
    tint: Colors.blue06,
  },
  pdf: {
    icon: 'ic_document',
    ink: Colors.red03,
    labelKey: 'request_detail.file_pdf',
    tint: Colors.red02,
  },
};

type Properties = {
  readonly attachment: TRequestAttachment;
  readonly onDownload: (id: string) => void;
};

/** Một tệp đính kèm: ô icon theo loại tệp, tên, dung lượng và nút tải về. */
function AttachmentRow({ attachment, onDownload }: Properties) {
  const { t } = useTranslation();
  const kind = ATTACHMENT_KINDS[attachment.kind];

  return (
    <View style={styles.container}>
      <View style={[styles.tile, { backgroundColor: kind.tint }]}>
        <Image
          color={kind.ink}
          height={FILE_ICON_SIZE}
          name={kind.icon}
          type="svg"
          width={FILE_ICON_SIZE}
        />
      </View>

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.name}>
          {attachment.name}
        </Text>
        <Text numberOfLines={1} style={styles.meta}>
          {t('request_detail.file_meta', {
            kind: t(kind.labelKey),
            size: attachment.sizeLabel,
          })}
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
  meta: {
    color: Colors.gray18,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(2),
  },
  name: {
    color: Colors.navy04,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
  tile: {
    alignItems: 'center',
    borderRadius: ScaleSize(10),
    height: TILE_SIZE,
    justifyContent: 'center',
    width: TILE_SIZE,
  },
});
