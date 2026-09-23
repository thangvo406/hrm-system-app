import ApprovalFlow from './ApprovalFlow';
import AttachmentBox from './AttachmentBox';
import BalanceCards from './BalanceCards';
import CreateRequestHeader from './CreateRequestHeader';
import DurationTabs from './DurationTabs';
import FormActions from './FormActions';
import FormField from './FormField';
import ReasonField from './ReasonField';
import SummaryBanner from './SummaryBanner';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useCreateRequest } from '@hooks';

/** Màn Tạo đơn nghỉ phép: số dư, nội dung đơn và luồng duyệt. */
function CreateRequest() {
  const {
    approvers,
    balances,
    canSubmit,
    duration,
    endDateLabel,
    kindLabel,
    onGoBack,
    onPickAttachment,
    onPickKind,
    onPickDates,
    onSaveDraft,
    onSubmit,
    reason,
    remainingDays,
    setDuration,
    setReason,
    source,
    sourceLabelKey,
    startDateLabel,
    totalDays,
  } = useCreateRequest();

  return (
    <View style={styles.container} testID="CreateRequestScreen">
      <CreateRequestHeader onGoBack={onGoBack} onSaveDraft={onSaveDraft} />

      <View style={styles.sheet}>
        {/*
          Không dùng `KeyboardAvoidingView` dùng chung ở đây: nó dịch cả khối
          bằng `translateY`, hợp với màn đăng nhập nơi nó nằm BÊN TRONG một
          `ScrollView`. Màn này ngược lại — `ScrollView` cuộn được sẵn và có
          thanh nút ghim đáy — nên để chính `ScrollView` chừa chỗ cho bàn phím,
          thanh nút vẫn ghim đúng đáy vùng còn lại.
        */}
        <ScrollView
          automaticallyAdjustKeyboardInsets
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <BalanceCards balances={balances} source={source} />

          <FormField
            icon="ic_calendar"
            labelKey="create_request.kind_label"
            onPress={onPickKind}
            showChevron
            testID="CreateRequestKind"
            value={kindLabel}
          />

          <View style={styles.dateRow}>
            <FormField
              icon="ic_calendar"
              labelKey="create_request.start_date_label"
              onPress={onPickDates}
              style={styles.flex}
              testID="CreateRequestStartDate"
              value={startDateLabel}
            />
            <FormField
              icon="ic_calendar"
              labelKey="create_request.end_date_label"
              onPress={onPickDates}
              style={styles.flex}
              testID="CreateRequestEndDate"
              value={endDateLabel}
            />
          </View>

          <DurationTabs onChange={setDuration} value={duration} />

          <SummaryBanner
            remainingDays={remainingDays}
            sourceLabelKey={sourceLabelKey}
            totalDays={totalDays}
          />

          <ReasonField onChangeText={setReason} value={reason} />

          <AttachmentBox onPress={onPickAttachment} />

          <ApprovalFlow steps={approvers} />
        </ScrollView>

        <FormActions
          canSubmit={canSubmit}
          onCancel={onGoBack}
          onSubmit={onSubmit}
        />
      </View>
    </View>
  );
}

export default CreateRequest;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.navy05,
    flex: 1,
  },
  content: {
    gap: ScaleSize(20),
    padding: ScaleSize(16),
    paddingBottom: ScaleSize(28),
  },
  dateRow: {
    flexDirection: 'row',
    gap: ScaleSize(12),
  },
  flex: {
    flex: 1,
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
