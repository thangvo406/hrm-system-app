import type { Paths } from '@navigation/paths';
import type { RootScreenProps } from '@navigation/types';

import ActivityLog from './ActivityLog';
import ApprovalTimeline from './ApprovalTimeline';
import AttachmentRow from './AttachmentRow';
import CancelAction from './CancelAction';
import InfoRows from './InfoRows';
import RequestDetailHeader from './RequestDetailHeader';
import SectionCard from './SectionCard';
import StatusBanner from './StatusBanner';
import SummaryCard from './SummaryCard';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRequestDetail } from '@hooks';

/**
 * Màn Chi tiết đơn từ.
 *
 * Bố cục cố định, còn NỘI DUNG thì bám theo trạng thái đơn: banner, luồng
 * duyệt, nhật ký và thanh huỷ đều đọc từ cùng một trạng thái. Khối đính kèm
 * biến mất khi đơn không có tệp nào, thay vì dựng một thẻ rỗng.
 */
function RequestDetail(props: RootScreenProps<Paths.RequestDetail>) {
  const { detail, onCancel, onDownload, onGoBack, onPressMore, showCancel } =
    useRequestDetail(props);

  return (
    <View style={styles.container} testID="RequestDetailScreen">
      <RequestDetailHeader onGoBack={onGoBack} onPressMore={onPressMore} />

      <View style={styles.sheet}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <SummaryCard detail={detail} />

          <StatusBanner status={detail.status} />

          <SectionCard icon="ic_document" titleKey="request_detail.info_title">
            <InfoRows detail={detail} />
          </SectionCard>

          {detail.attachments.length > 0 ? (
            <SectionCard
              icon="ic_paperclip"
              titleKey="request_detail.attachments_title"
            >
              <View style={styles.attachments}>
                {detail.attachments.map(attachment => (
                  <AttachmentRow
                    key={attachment.id}
                    attachment={attachment}
                    onDownload={onDownload}
                  />
                ))}
              </View>
            </SectionCard>
          ) : undefined}

          <SectionCard icon="user" titleKey="request_detail.approval_title">
            <ApprovalTimeline steps={detail.approvals} />
          </SectionCard>

          <SectionCard icon="ic_clock" titleKey="request_detail.activity_title">
            <ActivityLog activities={detail.activities} />
          </SectionCard>
        </ScrollView>

        {showCancel ? <CancelAction onCancel={onCancel} /> : undefined}
      </View>
    </View>
  );
}

export default RequestDetail;

const styles = StyleSheet.create({
  attachments: {
    gap: ScaleSize(10),
  },
  container: {
    backgroundColor: Colors.navy05,
    flex: 1,
  },
  content: {
    gap: ScaleSize(14),
    padding: ScaleSize(16),
    paddingBottom: ScaleSize(28),
  },
  // Tấm nền bo hai góc trên, trùm lên mép dưới dải navy đúng như thiết kế.
  sheet: {
    backgroundColor: Colors.gray28,
    borderTopLeftRadius: ScaleSize(22),
    borderTopRightRadius: ScaleSize(22),
    flex: 1,
    marginTop: -ScaleSize(16),
    overflow: 'hidden',
  },
});
