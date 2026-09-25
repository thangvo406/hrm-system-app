import AppButton from '@components/AppButton';
import EmptyView from '@components/EmptyView';
import Image from '@components/Image';
import React from 'react';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const ILLUSTRATION_SIZE = ScaleSize(200);
// Chốt bề ngang dòng mô tả để nó xuống dòng cân đối ở giữa, thay vì chạy sát
// hai mép rồi ngắt ở chỗ ngẫu nhiên.
const DESCRIPTION_WIDTH = ScaleSize(300);
const DESCRIPTION_LINE_HEIGHT = ScaleSize(21);
const ACTION_ICON_SIZE = ScaleSize(20);

type Properties = {
  /** Đang lọc thì không mời tạo đơn: tạo xong cũng chưa chắc lọt bộ lọc. */
  readonly isFiltered: boolean;
  readonly onPressCreate: () => void;
};

function RequestsEmpty({ isFiltered, onPressCreate }: Properties) {
  const { t } = useTranslation();

  const scope = isFiltered ? 'filtered' : 'all';

  return (
    <EmptyView
      icon="ic_request_empty"
      renderDesc={() => (
        <View style={styles.texts}>
          <Text style={styles.title}>{t(`requests.empty.${scope}.title`)}</Text>
          <Text style={styles.description}>
            {t(`requests.empty.${scope}.description`)}
          </Text>

          <AppButton
            onPress={onPressCreate}
            style={styles.action}
            testID="RequestsEmptyCreate"
          >
            <Image
              color={Colors.white}
              height={ACTION_ICON_SIZE}
              name="ic_plus_circle"
              type="svg"
              width={ACTION_ICON_SIZE}
            />
            <Text numberOfLines={1} style={styles.actionLabel}>
              {t('requests.empty.all.action')}
            </Text>
          </AppButton>
        </View>
      )}
      size={ILLUSTRATION_SIZE}
      style={styles.container}
      type="image"
    />
  );
}

export default React.memo(RequestsEmpty);

const styles = StyleSheet.create({
  // Cùng nền, bo góc và trọng lượng chữ với nút "Tạo đơn" trên header, để hai
  // lối vào cùng một hành động không trông như hai thứ khác nhau.
  action: {
    alignItems: 'center',
    backgroundColor: Colors.blue02,
    borderRadius: ScaleSize(14),
    flexDirection: 'row',
    gap: ScaleSize(8),
    justifyContent: 'center',
    marginTop: ScaleSize(24),
    minWidth: ScaleSize(240),
    paddingHorizontal: ScaleSize(24),
    paddingVertical: ScaleSize(14),
  },
  actionLabel: {
    color: Colors.white,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
  container: {
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(24),
  },
  description: {
    color: Colors.gray24,
    fontSize: ScaleSize(14),
    lineHeight: DESCRIPTION_LINE_HEIGHT,
    marginTop: ScaleSize(8),
    maxWidth: DESCRIPTION_WIDTH,
    textAlign: 'center',
  },
  texts: {
    alignItems: 'center',
    marginTop: ScaleSize(20),
  },
  title: {
    color: Colors.navy04,
    fontSize: ScaleSize(18),
    fontWeight: '700',
    textAlign: 'center',
  },
});
