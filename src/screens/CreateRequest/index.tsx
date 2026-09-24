import ApprovalFlow from './ApprovalFlow';
import AttachmentBox from './AttachmentBox';
import BalanceCards from './BalanceCards';
import CreateRequestHeader from './CreateRequestHeader';
import DurationTabs from './DurationTabs';
import FormActions from './FormActions';
import FormField from './FormField';
import HoursHint from './HoursHint';
import ReasonField from './ReasonField';
import SummaryBanner from './SummaryBanner';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useCreateRequest } from '@hooks';

function CreateRequest() {
  const {
    approvers,
    balances,
    canSubmit,
    dateLabel,
    duration,
    endDateLabel,
    endTime,
    eventKindLabel,
    leaveKindLabel,
    note,
    onGoBack,
    onPickAttachment,
    onPickDate,
    onPickDates,
    onPickEndTime,
    onPickEventKind,
    onPickLeaveKind,
    onPickOvertimeKind,
    onPickPlace,
    onPickStartTime,
    onPickType,
    onSaveDraft,
    onSubmit,
    overtimeKindLabel,
    placeLabel,
    reason,
    reasonLabelKey,
    reasonPlaceholderKey,
    remainingDays,
    sections,
    setDuration,
    setNote,
    setReason,
    singleDateLabelKey,
    source,
    sourceLabelKey,
    startDateLabel,
    startTime,
    titleKey,
    totalDays,
    totalHours,
    typeLabel,
  } = useCreateRequest();

  return (
    <View style={styles.container} testID="CreateRequestScreen">
      <CreateRequestHeader
        onGoBack={onGoBack}
        onSaveDraft={onSaveDraft}
        titleKey={titleKey}
      />

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
          {sections.has('balances') ? (
            <BalanceCards balances={balances} source={source} />
          ) : undefined}

          <FormField
            icon="ic_document"
            labelKey="create_request.type_label"
            onPress={onPickType}
            showChevron
            testID="CreateRequestType"
            value={typeLabel}
          />

          {sections.has('leave_kind') ? (
            <FormField
              icon="ic_calendar"
              labelKey="create_request.kind_label"
              onPress={onPickLeaveKind}
              showChevron
              testID="CreateRequestLeaveKind"
              value={leaveKindLabel}
            />
          ) : undefined}

          {sections.has('single_date') ? (
            <FormField
              icon="ic_calendar"
              labelKey={singleDateLabelKey}
              onPress={onPickDate}
              testID="CreateRequestDate"
              value={dateLabel}
            />
          ) : undefined}

          {sections.has('date_range') ? (
            <View style={styles.row}>
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
          ) : undefined}

          {sections.has('time_range') ? (
            <View style={styles.row}>
              <FormField
                icon="ic_clock"
                labelKey="create_request.start_time_label"
                onPress={onPickStartTime}
                style={styles.flex}
                testID="CreateRequestStartTime"
                value={startTime}
              />
              <FormField
                icon="ic_clock"
                labelKey="create_request.end_time_label"
                onPress={onPickEndTime}
                style={styles.flex}
                testID="CreateRequestEndTime"
                value={endTime}
              />
            </View>
          ) : undefined}

          {sections.has('time_range') ? (
            <HoursHint totalHours={totalHours} />
          ) : undefined}

          {sections.has('duration') ? (
            <DurationTabs onChange={setDuration} value={duration} />
          ) : undefined}

          {sections.has('event_kind') ? (
            <FormField
              icon="ic_warning"
              labelKey="create_request.event_label"
              onPress={onPickEventKind}
              showChevron
              testID="CreateRequestEventKind"
              value={eventKindLabel}
            />
          ) : undefined}

          {sections.has('overtime_kind') ? (
            <FormField
              icon="ic_tag"
              labelKey="create_request.overtime_kind_label"
              onPress={onPickOvertimeKind}
              showChevron
              testID="CreateRequestOvertimeKind"
              value={overtimeKindLabel}
            />
          ) : undefined}

          {sections.has('place') ? (
            <FormField
              icon="ic_location"
              labelKey="create_request.place_label"
              onPress={onPickPlace}
              showChevron
              testID="CreateRequestPlace"
              value={placeLabel}
            />
          ) : undefined}

          {sections.has('summary') ? (
            <SummaryBanner
              remainingDays={remainingDays}
              sourceLabelKey={sourceLabelKey}
              totalDays={totalDays}
            />
          ) : undefined}

          {sections.has('reason') ? (
            <ReasonField
              labelKey={reasonLabelKey}
              onChangeText={setReason}
              placeholderKey={reasonPlaceholderKey}
              value={reason}
            />
          ) : undefined}

          {sections.has('note') ? (
            <ReasonField
              labelKey="create_request.note_label"
              onChangeText={setNote}
              placeholderKey="create_request.note_placeholder"
              showCounter={false}
              testID="CreateRequestNote"
              value={note}
            />
          ) : undefined}

          {sections.has('attachment') ? (
            <AttachmentBox onPress={onPickAttachment} />
          ) : undefined}

          {/* Luồng duyệt do server trả; chưa có thì ẩn cả khối chứ không để
              lại một tiêu đề trên thẻ trắng. */}
          {approvers.length > 0 ? (
            <ApprovalFlow steps={approvers} />
          ) : undefined}
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
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: ScaleSize(12),
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
