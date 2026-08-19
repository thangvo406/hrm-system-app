import { Image } from '@components';
import { ScaleSize } from '@kits/core';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const ICON_BADGE_SIZE = ScaleSize(48);

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#8A8F86';
const VALUE_GREEN = '#2DB34A';
const DIVIDER_COLOR = '#ECEEEA';
const CARD_SHADOW = 'rgba(23, 68, 33, 0.08)';

type Properties = {
  readonly contributionAmount: string;
  readonly contributionUnits: string;
  readonly membershipLabel: string;
};

function MemberSummaryCard({
  contributionAmount,
  contributionUnits,
  membershipLabel,
}: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <View style={styles.column}>
        <Image
          height={ICON_BADGE_SIZE}
          name="ic_member_badge"
          type="svg"
          width={ICON_BADGE_SIZE}
        />
        <View style={styles.texts}>
          <Text style={styles.label}>
            {t('contribution_input.member_type_label')}
          </Text>
          <Text numberOfLines={1} style={styles.valueGreen}>
            {membershipLabel}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.column}>
        <Image
          height={ICON_BADGE_SIZE}
          name="ic_won_badge"
          type="svg"
          width={ICON_BADGE_SIZE}
        />
        <View style={styles.texts}>
          <Text style={styles.label}>
            {t('contribution_input.current_contribution_label')}
          </Text>
          <Text style={styles.valueGreen}>{contributionUnits}</Text>
          <Text style={styles.valueSub}> {contributionAmount}</Text>
        </View>
      </View>
    </View>
  );
}

export default React.memo(MemberSummaryCard);

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: ScaleSize(20),
    elevation: 4,
    flexDirection: 'row',
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(22),
    shadowColor: CARD_SHADOW,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 1,
    shadowRadius: ScaleSize(12),
  },
  column: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  divider: {
    alignSelf: 'stretch',
    backgroundColor: DIVIDER_COLOR,
    marginHorizontal: ScaleSize(10),
    width: ScaleSize(1),
  },
  label: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(12),
    fontWeight: '600',
  },
  texts: {
    flex: 1,
    marginLeft: ScaleSize(10),
  },
  valueGreen: {
    color: VALUE_GREEN,
    fontSize: ScaleSize(17),
    fontWeight: '800',
    marginTop: ScaleSize(4),
  },
  valueSub: {
    color: TEXT_DARK,
    fontSize: ScaleSize(12),
    fontWeight: '500',
  },
});
