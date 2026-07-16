import imageNames from '@assets/images/names';
import { AppButton, Button, Image, RadioButton } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { NOOP } from '@utils/common';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const BG_COLOR = '#F5F5F5';
const CARD_BG = '#FFFFFF';
const DANGER_COLOR = '#D0342C';
const DIVIDER_COLOR = '#F0F0F0';
const HEADER_TITLE_COLOR = '#1A1A1A';
const NOTICE_BG = '#E8F5E9';
const ICON_SIZE = ScaleSize(24);

const DELETE_REASONS = [
  'reason_dissatisfaction',
  'reason_rarely_use',
  'reason_privacy',
  'reason_other',
] as const;

type Properties = {
  readonly onSubmit?: (reason?: string) => void;
  readonly onRequestClose?: () => void;
};
type TReasonSelected = {
  id: string;
  value: string;
};

/**
 * Full-screen account-deletion confirmation rendered as a Dialog `screen`
 * (`isFullScreen`). Lists the data that will be removed, warns about the
 * contribution refund / re-register cooldown, and collects a delete reason
 * before confirming.
 */
function DeletionAccount({
  onSubmit = NOOP,
  onRequestClose = NOOP,
}: Properties) {
  const { t } = useTranslation();
  const [selectedReason, setSelectedReason] = useState<
    TReasonSelected | undefined
  >(undefined);

  const infoLines = [
    t('deletion_account.info_account'),
    t('deletion_account.info_points'),
    t('deletion_account.info_orders'),
    t('deletion_account.info_membership'),
  ];

  const handleDelete = () => {
    onRequestClose?.();
    onSubmit?.(selectedReason?.value);
  };

  return (
    <View style={styles.container} testID="deletion-account">
      <View style={styles.header}>
        <AppButton
          onPress={onRequestClose}
          style={styles.backButton}
          testID="deletion-account-back"
        >
          <Image
            color={HEADER_TITLE_COLOR}
            height={ICON_SIZE}
            name="ic_arrow_left_gray"
            type="svg"
            width={ICON_SIZE}
          />
        </AppButton>
        <Text numberOfLines={1} style={styles.headerTitle}>
          {t('deletion_account.title')}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Image
          height={ScaleSize(88)}
          name={imageNames.ic_logo_welcome}
          style={styles.mascot}
          width={ScaleSize(55)}
        />
        <Text style={styles.confirmQuestion}>
          {t('deletion_account.confirm_question')}
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            {t('deletion_account.info_title')}
          </Text>
          <View style={styles.divider} />
          {infoLines.map(line => (
            <View key={line} style={styles.infoRow}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>{line}</Text>
            </View>
          ))}
        </View>

        <View style={styles.noticeBox}>
          <Text style={styles.noticeTitle}>
            {t('deletion_account.notice_title')}
          </Text>
          <Text style={styles.noticeDesc}>
            {t('deletion_account.notice_line1')}
          </Text>
          <Text style={styles.noticeNote}>
            {t('deletion_account.notice_line2')}
          </Text>
        </View>

        <Text style={styles.reasonTitle}>
          {t('deletion_account.reason_title')}
        </Text>
        {DELETE_REASONS.map(reason => (
          <RadioButton
            key={reason}
            label={t(`deletion_account.${reason}`)}
            labelStyle={styles.reasonLabel}
            onPress={() => {
              setSelectedReason({
                id: reason,
                value: t(`deletion_account.${reason}`),
              });
            }}
            selected={selectedReason?.id === reason}
            style={styles.reasonCard}
            testID={`deletion-account-${reason}`}
          />
        ))}

        <Button
          onPress={handleDelete}
          style={styles.deleteButton}
          testID="deletion-account-delete"
          title={t('deletion_account.delete_button')}
          type="rounded"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    height: ICON_SIZE + ScaleSize(8),
    justifyContent: 'center',
    width: ICON_SIZE + ScaleSize(8),
  },
  confirmQuestion: {
    color: DANGER_COLOR,
    fontSize: ScaleSize(16),
    fontWeight: '700',
    marginTop: ScaleSize(24),
    textAlign: 'center',
  },
  container: {
    backgroundColor: BG_COLOR,
    flex: 1,
  },
  content: {
    paddingBottom: ScaleSize(24),
    paddingHorizontal: ScaleSize(16),
  },
  deleteButton: {
    backgroundColor: DANGER_COLOR,
    marginTop: ScaleSize(24),
    shadowColor: DANGER_COLOR,
  },
  divider: {
    backgroundColor: DIVIDER_COLOR,
    height: 1,
    marginVertical: ScaleSize(12),
  },
  header: {
    alignItems: 'center',
    backgroundColor: CARD_BG,
    flexDirection: 'row',
    paddingHorizontal: ScaleSize(12),
    paddingVertical: ScaleSize(10),
  },
  headerTitle: {
    color: HEADER_TITLE_COLOR,
    flex: 1,
    fontSize: ScaleSize(17),
    fontWeight: '700',
    paddingHorizontal: ScaleSize(8),
  },
  infoBullet: {
    color: DANGER_COLOR,
    fontSize: ScaleSize(13),
    lineHeight: ScaleSize(20),
    marginRight: ScaleSize(8),
  },
  infoCard: {
    backgroundColor: CARD_BG,
    borderRadius: ScaleSize(12),
    elevation: 3,
    marginTop: ScaleSize(24),
    padding: ScaleSize(16),
    shadowColor: '#000000',
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: ScaleSize(6),
  },
  infoText: {
    color: DANGER_COLOR,
    flex: 1,
    fontSize: ScaleSize(13),
    lineHeight: ScaleSize(20),
  },
  infoTitle: {
    color: HEADER_TITLE_COLOR,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
  mascot: {
    alignSelf: 'center',
    marginTop: ScaleSize(20),
  },
  noticeBox: {
    backgroundColor: NOTICE_BG,
    borderRadius: ScaleSize(12),
    marginTop: ScaleSize(24),
    padding: ScaleSize(14),
  },
  noticeDesc: {
    color: Colors.green01,
    fontSize: ScaleSize(11),
    lineHeight: ScaleSize(16),
    marginTop: ScaleSize(8),
  },
  noticeNote: {
    color: Colors.gray06,
    fontSize: ScaleSize(10),
    lineHeight: ScaleSize(15),
    marginTop: ScaleSize(2),
  },
  noticeTitle: {
    color: Colors.green01,
    fontSize: ScaleSize(13),
    fontWeight: '700',
  },
  reasonCard: {
    backgroundColor: CARD_BG,
    borderRadius: ScaleSize(28),
    elevation: 3,
    marginTop: ScaleSize(12),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(14),
    shadowColor: '#000000',
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  reasonLabel: {
    color: HEADER_TITLE_COLOR,
    fontSize: ScaleSize(14),
  },
  reasonTitle: {
    color: Colors.gray06,
    fontSize: ScaleSize(13),
    marginTop: ScaleSize(24),
  },
});

export default React.memo(DeletionAccount);
