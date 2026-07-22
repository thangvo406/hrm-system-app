import { Button, Image } from '@components';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ScaleSize } from '@kits/core';

const TITLE_COLOR = '#1A1A1A';
const DESC_COLOR = '#9E9E9E';
const BUTTON_GAP = ScaleSize(12);
const TITLE_FONT_SIZE = ScaleSize(20);
const DESC_FONT_SIZE = ScaleSize(13);
const CONTENT_GAP = ScaleSize(10);

type IIconInfo = {
  name: never;
  type?: 'image' | 'svg';
};

type InformationProps = {
  readonly cancelTitle?: string;
  readonly confirmTitle?: string;
  readonly desc?: string;
  readonly needTranslate?: boolean;
  readonly onCancel?: () => void;
  readonly onConfirm?: () => void;
  readonly onRequestClose?: () => void;
  readonly title?: string;
  readonly iconInfo?: IIconInfo;
};

/**
 * Confirmation dialog rendered as a Dialog `screen`. The host wraps it in a
 * rounded, centered card; this component lays out the title, description and
 * the Confirm (rounded) / Cancel (outline) action row.
 *
 * `title` / `desc` come from the caller's props. When `needTranslate` is true
 * they are treated as i18n keys; otherwise they are shown verbatim.
 */
function Information({
  cancelTitle,
  confirmTitle,
  desc,
  needTranslate,
  onCancel,
  onConfirm,
  onRequestClose,
  title,
  iconInfo,
}: InformationProps) {
  const { t } = useTranslation();

  const translate = (value?: string): string => {
    if (value === undefined) return '';
    return needTranslate ? t(value) : value;
  };

  const handleConfirm = () => {
    onConfirm?.();
    onRequestClose?.();
  };

  const handleCancel = () => {
    onCancel?.();
    onRequestClose?.();
  };

  return (
    <View style={styles.container} testID="information-dialog">
      <View style={styles.content}>
        {!!iconInfo && (
          <Image
            name={iconInfo?.name}
            type={iconInfo?.type}
            width={ScaleSize(66)}
            height={ScaleSize(66)}
            style={{
              alignSelf: 'center',
            }}
          />
        )}
        {title === undefined ? undefined : (
          <Text style={styles.title} testID="information-title">
            {translate(title)}
          </Text>
        )}
        {desc === undefined ? undefined : (
          <Text style={styles.desc} testID="information-desc">
            {translate(desc)}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        {!!confirmTitle && (
          <Button
            onPress={handleConfirm}
            style={styles.actionButton}
            testID="information-confirm"
            title={translate(confirmTitle)}
            type="rounded"
          />
        )}
        {!!cancelTitle && (
          <Button
            onPress={handleCancel}
            style={styles.actionButton}
            testID="information-cancel"
            title={translate(cancelTitle)}
            type="outline"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    flex: 1,
    height: ScaleSize(40),
  },
  actions: {
    flexDirection: 'row',
    gap: BUTTON_GAP,
    marginTop: ScaleSize(24),
  },
  container: {
    width: '100%',
  },
  content: {
    alignItems: 'center',
    gap: CONTENT_GAP,
  },
  desc: {
    color: DESC_COLOR,
    fontSize: DESC_FONT_SIZE,
    lineHeight: ScaleSize(20),
    textAlign: 'center',
  },
  title: {
    color: TITLE_COLOR,
    fontSize: TITLE_FONT_SIZE,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default React.memo(Information);
