import type { TRequestApprovalStep } from '@type/requests';

import Image from '@components/Image';
import React from 'react';
import { APPROVAL_STEP_VIEWS } from './requestStatusViews';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const NODE_SIZE = ScaleSize(24);
const NODE_ICON_SIZE = ScaleSize(14);
const CONNECTOR_WIDTH = 2;
const NO_TIME_PLACEHOLDER = '--';

type Properties = {
  readonly steps: readonly TRequestApprovalStep[];
};

/**
 * Đường đi của đơn qua từng cấp duyệt — thứ người dùng mở màn này để xem.
 *
 * Đây là một chuỗi có thứ tự thật, nên hình khối theo bước là đúng chỗ: dấu
 * tích xanh là đã duyệt, dấu X đỏ là đã từ chối, đồng hồ cam là đơn đang nằm
 * ở đó, nút rỗng là chưa tới lượt. Đoạn nối cũng đổi màu theo bước ĐỨNG TRƯỚC,
 * nên nhìn màu là biết đơn đã đi tới đâu mà không cần đọc chữ.
 */
function ApprovalTimeline({ steps }: Properties) {
  const { t } = useTranslation();

  return (
    <View>
      {steps.map((step, index) => {
        const view = APPROVAL_STEP_VIEWS[step.status];
        const isLast = index === steps.length - 1;
        const isReached = step.status !== 'waiting';

        return (
          <View key={step.id} style={styles.step}>
            <View style={styles.rail}>
              <View
                style={[
                  styles.node,
                  {
                    backgroundColor: view.background,
                    borderColor: isReached ? view.background : Colors.gray15,
                  },
                ]}
              >
                {view.icon ? (
                  <Image
                    color={view.foreground}
                    height={NODE_ICON_SIZE}
                    name={view.icon}
                    type="svg"
                    width={NODE_ICON_SIZE}
                  />
                ) : undefined}
              </View>

              {isLast ? undefined : (
                <View
                  style={[
                    styles.connector,
                    view.continues && { backgroundColor: Colors.green12 },
                  ]}
                />
              )}
            </View>

            <View style={[styles.content, isLast && styles.contentLast]}>
              <View style={styles.headerRow}>
                <Text numberOfLines={1} style={styles.title}>
                  {t(step.roleKey)}
                </Text>
                <Text style={styles.time}>
                  {step.at ?? NO_TIME_PLACEHOLDER}
                </Text>
              </View>

              <Text numberOfLines={1} style={styles.name}>
                {step.name}
              </Text>

              {view.noteKey ? (
                <Text numberOfLines={1} style={styles.note}>
                  {t(view.noteKey)}
                </Text>
              ) : undefined}
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default React.memo(ApprovalTimeline);

const styles = StyleSheet.create({
  connector: {
    backgroundColor: Colors.gray19,
    flex: 1,
    marginVertical: ScaleSize(4),
    width: CONNECTOR_WIDTH,
  },
  content: {
    flex: 1,
    paddingBottom: ScaleSize(18),
  },
  contentLast: {
    paddingBottom: 0,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(8),
    justifyContent: 'space-between',
  },
  name: {
    color: Colors.gray17,
    fontSize: ScaleSize(13),
    marginTop: ScaleSize(2),
  },
  node: {
    alignItems: 'center',
    borderRadius: NODE_SIZE / 2,
    borderWidth: ScaleSize(2),
    height: NODE_SIZE,
    justifyContent: 'center',
    width: NODE_SIZE,
  },
  note: {
    color: Colors.gray18,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(2),
  },
  // Cột trái giữ nút và đoạn nối; `alignItems: center` để đoạn nối chạy đúng
  // tâm nút chứ không lệch sang một bên.
  rail: {
    alignItems: 'center',
    marginRight: ScaleSize(12),
  },
  step: {
    flexDirection: 'row',
  },
  time: {
    color: Colors.gray18,
    fontSize: ScaleSize(12),
  },
  title: {
    color: Colors.navy04,
    flexShrink: 1,
    fontSize: ScaleSize(14),
    fontWeight: '700',
  },
});
