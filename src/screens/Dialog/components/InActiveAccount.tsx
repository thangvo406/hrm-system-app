import imageNames from '@assets/images/names';
import { AppButton, Button, Image } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { NOOP } from '@utils/common';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const BG_COLOR = '#F5F5F5';
const CARD_BG = '#FFFFFF';
const DIVIDER_COLOR = '#F0F0F0';
const HEADER_TITLE_COLOR = '#1A1A1A';
const REACTIVATION_BG = '#E8F5E9';
const ICON_SIZE = ScaleSize(24);

type Properties = {
  readonly archivedInformation?: string;
  readonly dormantDate?: string;
  readonly expiredInformation?: string;
  readonly lastLoginDate?: string;
  readonly onDeleteAccount?: () => void;
  readonly onReactivate?: () => void;
  readonly onRequestClose?: () => void;
};

function InActiveAccount({
  archivedInformation = '',
  dormantDate = '',
  expiredInformation = '',
  lastLoginDate = '',
  onDeleteAccount = NOOP,
  onReactivate = NOOP,
  onRequestClose = NOOP,
}: Properties) {
  const { t } = useTranslation();

  const _onDeleteAccount = () => {
    onDeleteAccount();
  };
  const _onReactivate = () => {
    onReactivate();
  };

  const emptyValue = '-';
  const infoRows = [
    {
      label: t('inactive_account.last_login_date'),
      value: lastLoginDate
        ? dayjs(lastLoginDate).format('YYYY.MM.DD')
        : emptyValue,
    },
    {
      label: t('inactive_account.dormant_date'),
      value: dormantDate ? dayjs(dormantDate).format('YYYY.MM.DD') : emptyValue,
    },
    {
      label: t('inactive_account.archived_info'),
      value: archivedInformation || t('inactive_account.archived_info_default'),
    },
    {
      label: t('inactive_account.expired_info'),
      value: expiredInformation || t('inactive_account.expired_info_default'),
    },
  ];

  return (
    <View style={styles.container} testID="inactive-account">
      <View style={styles.header}>
        <AppButton
          onPress={onRequestClose}
          style={styles.backButton}
          testID="inactive-account-back"
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
          {t('inactive_account.title')}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Image
          name={imageNames.ic_logo_welcome}
          width={ScaleSize(55)}
          height={ScaleSize(88)}
          style={{
            alignSelf: 'center',
            marginTop: ScaleSize(20),
          }}
        />
        <Text style={styles.noticeTitle}>
          {t('inactive_account.dormant_title')}
        </Text>
        <Text style={styles.noticeDesc}>
          {t('inactive_account.dormant_desc')}
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            {t('inactive_account.info_title')}
          </Text>
          <View style={styles.divider} />
          {infoRows.map(row => (
            <View key={row.label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.reactivationBox}>
          <Text style={styles.reactivationTitle}>
            {t('inactive_account.reactivation_title')}
          </Text>
          <Text style={styles.reactivationDesc}>
            {t('inactive_account.reactivation_desc')}
          </Text>
          <Text style={styles.reactivationNote}>
            {t('inactive_account.reactivation_note')}
          </Text>
        </View>

        <Button
          onPress={_onReactivate}
          style={styles.reactivateButton}
          testID="inactive-account-reactivate"
          title={t('inactive_account.reactivate_button')}
          type="rounded"
        />
        <Button
          onPress={_onDeleteAccount}
          style={styles.deleteButton}
          testID="inactive-account-delete"
          title={t('inactive_account.delete_button')}
          type="outline-bordered"
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
  container: {
    backgroundColor: BG_COLOR,
    flex: 1,
  },
  content: {
    paddingBottom: ScaleSize(24),
    paddingHorizontal: ScaleSize(16),
  },
  deleteButton: {
    marginTop: ScaleSize(12),
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
  infoCard: {
    backgroundColor: CARD_BG,
    borderRadius: ScaleSize(12),
    elevation: 3,
    marginTop: ScaleSize(32),
    padding: ScaleSize(16),
    shadowColor: '#000000',
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  infoLabel: {
    color: Colors.gray06,
    fontSize: ScaleSize(13),
    width: '50%',
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginTop: ScaleSize(8),
  },
  infoTitle: {
    color: HEADER_TITLE_COLOR,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
  infoValue: {
    color: HEADER_TITLE_COLOR,
    fontSize: ScaleSize(13),
    fontWeight: '700',
    width: '50%',
    // marginLeft: ScaleSize(12),
  },
  noticeDesc: {
    color: Colors.gray06,
    fontSize: ScaleSize(12),
    lineHeight: ScaleSize(18),
    marginTop: ScaleSize(8),
    textAlign: 'center',
    marginHorizontal: ScaleSize(60),
  },
  noticeTitle: {
    color: HEADER_TITLE_COLOR,
    fontSize: ScaleSize(18),
    fontWeight: '700',
    marginTop: ScaleSize(20),
    textAlign: 'center',
  },
  reactivateButton: {
    marginTop: ScaleSize(24),
  },
  reactivationBox: {
    backgroundColor: REACTIVATION_BG,
    borderRadius: ScaleSize(12),
    marginTop: ScaleSize(16),
    padding: ScaleSize(14),
  },
  reactivationDesc: {
    color: Colors.green01,
    fontSize: ScaleSize(11),
    lineHeight: ScaleSize(16),
    marginTop: ScaleSize(8),
  },
  reactivationNote: {
    color: Colors.gray06,
    fontSize: ScaleSize(10),
    lineHeight: ScaleSize(15),
    marginTop: ScaleSize(2),
  },
  reactivationTitle: {
    color: Colors.green01,
    fontSize: ScaleSize(13),
    fontWeight: '700',
  },
});

export default React.memo(InActiveAccount);
