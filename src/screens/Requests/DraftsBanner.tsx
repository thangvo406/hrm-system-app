import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

const DRAFT_ICON_SIZE = ScaleSize(18);

type Properties = {
  readonly count: number;
};

function DraftsBanner({ count }: Properties) {
  const { t } = useTranslation();

  return (
    <AppButton style={styles.container} testID="RequestsDrafts">
      <Image
        color={Colors.blue04}
        height={DRAFT_ICON_SIZE}
        name="ic_document"
        type="svg"
        width={DRAFT_ICON_SIZE}
      />

      <Text numberOfLines={1} style={styles.label}>
        {t('requests.drafts_banner', { total: count })}
      </Text>
    </AppButton>
  );
}

export default React.memo(DraftsBanner);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.blue07,
    borderRadius: ScaleSize(12),
    flexDirection: 'row',
    gap: ScaleSize(10),
    marginHorizontal: ScaleSize(16),
    marginTop: ScaleSize(12),
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(12),
  },
  label: {
    color: Colors.navy04,
    // Nhãn nuốt hết chỗ trống để chevron bị đẩy sát mép phải.
    flex: 1,
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
});
