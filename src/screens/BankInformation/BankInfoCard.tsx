import { Image } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import AppNavigator from '@navigation/AppNavigator';
import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import CopyButton from './CopyButton';
import { IManualTransfer } from '@type';

const GREEN = Colors.primary;
const GREEN_BG = Colors.green03;
const PURPLE = '#8B5CF6';
const PURPLE_BG = '#F3E9FF';
const BLUE = '#3B82F6';
const BLUE_BG = '#EDF4FF';
const BLUE_BORDER = '#A9CBF7';
const LABEL_COLOR = '#6B7280';
const VALUE_COLOR = '#1A1A1A';
const DIVIDER_COLOR = '#EEF0F2';
const DASHED_COLOR = '#D4D9DE';
const CARD_BORDER = '#F1F3F4';
const NOTE_BOX_BG = '#FFFFFF';

const BANK_IMG_HEIGHT = ScaleSize(70);
const BANK_IMG_WIDTH = ScaleSize(84);
const TILE_ICON_SIZE = ScaleSize(22);

type BankInfoCardProps = {
  readonly data?: IManualTransfer;
};

function BankInfoCard({ data }: BankInfoCardProps) {
  const { t } = useTranslation();

  const copyValue = (value: string) => {
    Clipboard.setString(value);
    AppNavigator.showSnackBar({
      message: t('bank_information.copied'),
      type: 'success',
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.bankRow}>
        <View style={styles.bankInfo}>
          <View style={styles.bankBadge}>
            <Text style={styles.bankBadgeText}>
              {t('bank_information.bank_label')}
            </Text>
          </View>
          <Text style={styles.bankName}>{data?.bankName}</Text>
          {/* {bankNameEn ? (
            <Text style={styles.bankNameEn}>{bankNameEn}</Text>
          ) : undefined} */}
        </View>
        <Image
          height={BANK_IMG_HEIGHT}
          name="img_bank_info"
          width={BANK_IMG_WIDTH}
        />
      </View>

      <View style={styles.dashedDivider} />

      <View style={styles.infoRow}>
        <View style={[styles.iconTile, styles.iconTileGreen]}>
          <Image
            color={GREEN}
            height={TILE_ICON_SIZE}
            name="ic_credit_card_filled"
            type="svg"
            width={TILE_ICON_SIZE}
          />
        </View>
        <View style={styles.infoTexts}>
          <Text style={styles.label}>
            {t('bank_information.account_number')}
          </Text>
          <Text style={styles.value}>{data?.bankAccountNumber}</Text>
        </View>
        <CopyButton
          color={GREEN}
          onPress={() => {
            copyValue(data?.bankAccountNumber || '');
          }}
          testID="bank-info-copy-account-number"
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <View style={[styles.iconTile, styles.iconTilePurple]}>
          <Image
            color={PURPLE}
            height={TILE_ICON_SIZE}
            name="ic_user_filled"
            type="svg"
            width={TILE_ICON_SIZE}
          />
        </View>
        <View style={styles.infoTexts}>
          <Text style={styles.label}>
            {t('bank_information.account_holder')}
          </Text>
          <Text style={styles.value}>{data?.bankAccountHolder}</Text>
        </View>
        <CopyButton
          backgroundColor={PURPLE_BG}
          color={PURPLE}
          onPress={() => {
            copyValue(data?.bankAccountHolder || '');
          }}
          testID="bank-info-copy-account-holder"
        />
      </View>

      <View style={styles.noteSection}>
        <View style={styles.noteHeader}>
          <View style={styles.noteIcon}>
            <Image
              color={BLUE}
              height={TILE_ICON_SIZE}
              name="ic_pencil"
              type="svg"
              width={TILE_ICON_SIZE}
            />
          </View>
          <View style={styles.infoTexts}>
            <Text style={styles.noteTitle}>
              {t('bank_information.note_title')}
            </Text>
            <Text style={styles.noteDesc}>
              {t('bank_information.note_required')}
            </Text>
          </View>
        </View>
        <View style={styles.noteRow}>
          <View style={styles.noteBox}>
            <Text style={styles.noteFormat}>{data?.transferCode}</Text>
          </View>
          <CopyButton
            color={BLUE}
            onPress={() => {
              copyValue(data?.transferCode || '');
            }}
            testID="bank-info-copy-note"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bankBadge: {
    alignSelf: 'flex-start',
    backgroundColor: GREEN_BG,
    borderRadius: ScaleSize(14),
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(5),
  },
  bankBadgeText: {
    color: GREEN,
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
  bankInfo: {
    flex: 1,
  },
  bankName: {
    color: VALUE_COLOR,
    fontSize: ScaleSize(26),
    fontWeight: '700',
    marginTop: ScaleSize(10),
  },
  bankNameEn: {
    color: LABEL_COLOR,
    fontSize: ScaleSize(15),
    marginTop: ScaleSize(2),
  },
  bankRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: CARD_BORDER,
    borderRadius: ScaleSize(22),
    borderWidth: 1,
    elevation: 4,
    padding: ScaleSize(18),
    shadowColor: '#000000',
    shadowOffset: { height: ScaleSize(6), width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: ScaleSize(14),
  },
  dashedDivider: {
    borderColor: DASHED_COLOR,
    borderStyle: 'dashed',
    borderTopWidth: 1,
    marginVertical: ScaleSize(14),
  },
  divider: {
    backgroundColor: DIVIDER_COLOR,
    height: 1,
    marginVertical: ScaleSize(14),
  },
  iconTile: {
    alignItems: 'center',
    borderRadius: ScaleSize(13),
    height: ScaleSize(44),
    justifyContent: 'center',
    width: ScaleSize(44),
  },
  iconTileGreen: {
    backgroundColor: GREEN_BG,
  },
  iconTilePurple: {
    backgroundColor: PURPLE_BG,
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(12),
  },
  infoTexts: {
    flex: 1,
  },
  label: {
    color: LABEL_COLOR,
    fontSize: ScaleSize(13),
  },
  noteBox: {
    backgroundColor: NOTE_BOX_BG,
    borderColor: BLUE_BORDER,
    borderRadius: ScaleSize(12),
    borderStyle: 'dashed',
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(10),
  },
  noteDesc: {
    color: LABEL_COLOR,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(2),
  },
  noteExample: {
    color: LABEL_COLOR,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(2),
  },
  noteFormat: {
    color: VALUE_COLOR,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
  noteHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(12),
  },
  noteIcon: {
    alignItems: 'center',
    backgroundColor: NOTE_BOX_BG,
    borderRadius: ScaleSize(22),
    height: ScaleSize(44),
    justifyContent: 'center',
    width: ScaleSize(44),
  },
  noteRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(10),
    marginTop: ScaleSize(12),
  },
  noteSection: {
    backgroundColor: BLUE_BG,
    borderRadius: ScaleSize(16),
    marginTop: ScaleSize(16),
    padding: ScaleSize(12),
  },
  noteTitle: {
    color: BLUE,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
  value: {
    color: VALUE_COLOR,
    fontSize: ScaleSize(17),
    fontWeight: '700',
    marginTop: ScaleSize(2),
  },
});

export default React.memo(BankInfoCard);
