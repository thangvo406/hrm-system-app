import { AppButton, Image } from '@components';
import { ScaleSize } from '@kits/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';

const DEFAULT_BG = '#FFFFFF';
const ICON_SIZE = ScaleSize(15);
const BORDER_ALPHA = '33';

type CopyButtonProps = {
  readonly backgroundColor?: string;
  readonly color: string;
  readonly onPress: () => void;
  readonly testID: string;
};

function CopyButton({
  backgroundColor = DEFAULT_BG,
  color,
  onPress,
  testID,
}: CopyButtonProps) {
  const { t } = useTranslation();

  return (
    <AppButton
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor, borderColor: `${color}${BORDER_ALPHA}` },
      ]}
      testID={testID}
    >
      <Image
        color={color}
        height={ICON_SIZE}
        name="ic_copy"
        type="svg"
        width={ICON_SIZE}
      />
      <Text style={[styles.label, { color }]}>
        {t('bank_information.copy')}
      </Text>
    </AppButton>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: ScaleSize(19),
    borderWidth: 1,
    flexDirection: 'row',
    gap: ScaleSize(5),
    paddingHorizontal: ScaleSize(13),
    paddingVertical: ScaleSize(9),
  },
  label: {
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
});

export default React.memo(CopyButton);
