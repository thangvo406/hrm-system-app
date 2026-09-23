import AppButton from '@components/AppButton';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const SEND_ICON_SIZE = ScaleSize(20);
const DISABLED_OPACITY = 0.5;

type Properties = {
  /** Chặn gửi khi form chưa hợp lệ, ví dụ chưa nhập lý do. */
  readonly canSubmit: boolean;
  readonly onCancel: () => void;
  readonly onSubmit: () => void;
};

/** Thanh nút cố định ở đáy màn: huỷ bỏ hoặc gửi đơn. */
function FormActions({ canSubmit, onCancel, onSubmit }: Properties) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom || ScaleSize(16) },
      ]}
    >
      <AppButton
        onPress={onCancel}
        style={styles.cancelButton}
        testID="CreateRequestCancel"
      >
        <Text style={styles.cancelLabel}>{t('create_request.cancel')}</Text>
      </AppButton>

      <AppButton
        disabled={!canSubmit}
        onPress={onSubmit}
        style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
        testID="CreateRequestSubmit"
      >
        <Image
          color={Colors.white}
          height={SEND_ICON_SIZE}
          name="ic_send"
          type="svg"
          width={SEND_ICON_SIZE}
        />
        <Text style={styles.submitLabel}>{t('create_request.submit')}</Text>
      </AppButton>
    </View>
  );
}

export default React.memo(FormActions);

const styles = StyleSheet.create({
  cancelButton: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.gray19,
    borderRadius: ScaleSize(14),
    borderWidth: 1,
    paddingHorizontal: ScaleSize(28),
    paddingVertical: ScaleSize(16),
  },
  cancelLabel: {
    color: Colors.navy04,
    fontSize: ScaleSize(16),
    fontWeight: '600',
  },
  container: {
    backgroundColor: Colors.white,
    borderTopColor: Colors.gray19,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: ScaleSize(12),
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(12),
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: Colors.blue02,
    borderRadius: ScaleSize(14),
    flex: 1,
    flexDirection: 'row',
    gap: ScaleSize(10),
    justifyContent: 'center',
    paddingVertical: ScaleSize(16),
  },
  submitButtonDisabled: {
    opacity: DISABLED_OPACITY,
  },
  submitLabel: {
    color: Colors.white,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
});
