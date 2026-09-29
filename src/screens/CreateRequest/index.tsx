import ApprovalFlow from './ApprovalFlow';
import AttachmentBox from './AttachmentBox';
import BalanceCards from './BalanceCards';
import CreateRequestHeader from './CreateRequestHeader';
import DraftBanner from './DraftBanner';
import DurationTabs from './DurationTabs';
import FormActions from './FormActions';
import FormField from './FormField';
import HoursHint from './HoursHint';
import ReasonField from './ReasonField';
import SummaryBanner from './SummaryBanner';
import type { RootScreenProps } from '@navigation/types';

import { Colors } from '@constants';
import { Paths } from '@navigation/paths';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useCreateRequest } from '@hooks';

function CreateRequest(props: RootScreenProps<Paths.CreateRequest>) {
  const {
    approvers,
    balances,
    canSubmit,
    formKey,
    hasDraft,
    keys,
    labels,
    duration,
    endTime,
    note,
    onGoBack,
    onApplyDraft,
    onPickAttachment,
    onPickDateRange,
    onPickSingleDate,
    onPickEndTime,
    onPickEventKind,
    onPickLeaveKind,
    onPickPlace,
    onPickStartTime,
    onPickType,
    onSaveDraft,
    onSubmit,
    reason,
    remainingDays,
    sections,
    setField,
    source,
    startTime,
    totalDays,
    totalHours,
  } = useCreateRequest(props);

  return (
    <View style={styles.container} testID="CreateRequestScreen">
      <CreateRequestHeader
        onGoBack={onGoBack}
        onSaveDraft={onSaveDraft}
        titleKey={keys.title}
      />

      <View style={styles.sheet}>
        <ScrollView
          automaticallyAdjustKeyboardInsets
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {hasDraft ? (
            <DraftBanner onApply={onApplyDraft} typeLabel={labels.type} />
          ) : undefined}

          {sections.has('balances') ? (
            <BalanceCards balances={balances} source={source} />
          ) : undefined}

          <FormField
            icon="ic_document"
            labelKey="create_request.type_label"
            onPress={onPickType}
            showChevron
            testID="CreateRequestType"
            value={labels.type}
          />

          {sections.has('leave_kind') ? (
            <FormField
              icon="ic_calendar"
              labelKey="create_request.kind_label"
              onPress={onPickLeaveKind}
              showChevron
              testID="CreateRequestLeaveKind"
              value={labels.leaveKind}
            />
          ) : undefined}

          {sections.has('single_date') ? (
            <FormField
              icon="ic_calendar"
              labelKey={keys.singleDateLabel}
              onPress={onPickSingleDate}
              testID="CreateRequestDate"
              value={labels.date}
            />
          ) : undefined}

          {sections.has('date_range') ? (
            <View style={styles.row}>
              <FormField
                icon="ic_calendar"
                labelKey="create_request.start_date_label"
                onPress={onPickDateRange}
                style={styles.flex}
                testID="CreateRequestStartDate"
                value={labels.startDate}
              />
              <FormField
                icon="ic_calendar"
                labelKey="create_request.end_date_label"
                onPress={onPickDateRange}
                style={styles.flex}
                testID="CreateRequestEndDate"
                value={labels.endDate}
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
            <DurationTabs onChange={setField('duration')} value={duration} />
          ) : undefined}

          {sections.has('event_kind') ? (
            <FormField
              icon="ic_warning"
              labelKey="create_request.event_label"
              onPress={onPickEventKind}
              showChevron
              testID="CreateRequestEventKind"
              value={labels.eventKind}
            />
          ) : undefined}

          {sections.has('place') ? (
            <FormField
              icon="ic_location"
              labelKey="create_request.place_label"
              onPress={onPickPlace}
              showChevron
              testID="CreateRequestPlace"
              value={labels.place}
            />
          ) : undefined}

          {sections.has('summary') ? (
            <SummaryBanner
              remainingDays={remainingDays}
              sourceLabelKey={keys.sourceLabel}
              totalDays={totalDays}
            />
          ) : undefined}

          {sections.has('reason') ? (
            <ReasonField
              defaultValue={reason}
              key={`reason-${formKey}`}
              labelKey={keys.reasonLabel}
              onChangeText={setField('reason')}
              placeholderKey={keys.reasonPlaceholder}
            />
          ) : undefined}

          {sections.has('note') ? (
            <ReasonField
              defaultValue={note}
              key={`note-${formKey}`}
              labelKey="create_request.note_label"
              onChangeText={setField('note')}
              placeholderKey="create_request.note_placeholder"
              showCounter={false}
              testID="CreateRequestNote"
            />
          ) : undefined}

          {sections.has('attachment') ? (
            <AttachmentBox onPress={onPickAttachment} />
          ) : undefined}

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
