import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const DRAFT_ICON_SIZE = ScaleSize(18);

type Properties = {
  readonly onApply: () => void;
  readonly typeLabel: string;
};

function DraftBanner({ onApply, typeLabel }: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Image
        color={Colors.blue04}
        height={DRAFT_ICON_SIZE}
        name="ic_document"
        type="svg"
        width={DRAFT_ICON_SIZE}
      />

      <Text numberOfLines={2} style={styles.label}>
        {t('create_request.draft_banner', { type: typeLabel })}
      </Text>

      <AppButton
        onPress={onApply}
        style={styles.button}
        testID="CreateRequestApplyDraft"
      >
        <Text numberOfLines={1} style={styles.buttonLabel}>
          {t('create_request.draft_restore')}
        </Text>
      </AppButton>
    </View>
  );
}

export default React.memo(DraftBanner);

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.blue04,
    borderRadius: ScaleSize(16),
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(8),
  },
  buttonLabel: {
    color: Colors.white,
    fontSize: ScaleSize(13),
    fontWeight: '700',
  },
  container: {
    alignItems: 'center',
    backgroundColor: Colors.blue07,
    borderRadius: ScaleSize(12),
    flexDirection: 'row',
    gap: ScaleSize(10),
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(14),
  },
  label: {
    color: Colors.navy04,
    flex: 1,
    fontSize: ScaleSize(14),
    fontWeight: '600',
    lineHeight: ScaleSize(20),
  },
});
