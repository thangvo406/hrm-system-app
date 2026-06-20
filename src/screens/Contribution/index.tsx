import type { Profile as ProfileType } from '@services/request/account';

import { Image, HeaderDetail, Button } from '@components';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import { ScaleSize } from '@kits/core';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';

const CHEVRON_SIZE = ScaleSize(20);
const ARROW_SIZE = ScaleSize(18);
const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#6B6B6B';
const GREEN_DARK = '#33A23C';
const GREEN_LIGHT = '#54C158';
const DARK_PILL = '#2B2F33';
const CONTRIBUTION_AMOUNT = '2,500,000';
const DEPOSIT_AMOUNT = '100,000';
const POINT_AMOUNT = '11,000';

const onOpenPayCard = () => {
  AppNavigator.navigate(Paths.PayCard);
};

type ContributionRowProps = {
  readonly label: string;
};

function GradientBackground() {
  return (
    <LinearGradient
      colors={[GREEN_DARK, GREEN_LIGHT]}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={StyleSheet.absoluteFill}
    />
  );
}

function NameBlock({ name }: { readonly name: string }) {
  const { t } = useTranslation();
  return (
    <View style={styles.nameBlock}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>{t('contribution.school_label')}</Text>
        <Text style={styles.metaText}>{t('contribution.status_label')}</Text>
        <Text style={styles.metaText}>{t('contribution.group_label')}</Text>
      </View>
    </View>
  );
}

function ContributionCard() {
  const { t } = useTranslation();
  return (
    <View style={styles.contributionCard} testID="contribution-card">
      <GradientBackground />
      <Text style={styles.contributionTitle}>
        {t('contribution.contribution_title')}
      </Text>
      <Text style={styles.contributionTotalLabel}>
        {t('contribution.contribution_total_label')}
      </Text>
      <Text style={styles.contributionAmount}>
        {t('contribution.contribution_amount', { amount: CONTRIBUTION_AMOUNT })}
      </Text>
      <View
        style={{
          marginTop: ScaleSize(28),
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.whitePill, { width: '70%' }]}
          testID="contribution-history"
        >
          <Text style={styles.whitePillText}>
            {t('contribution.contribution_history')}
          </Text>
        </TouchableOpacity>
        <View style={styles.contributionActions}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.whitePill}
            testID="contribution-history"
          >
            <Text style={styles.whitePillText}>
              {t('contribution.capital_contribution')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.whitePill}
            testID="contribution-add"
          >
            <Text style={styles.whitePillText}>
              {t('contribution.withdrawal_capital')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function PaySection() {
  const { t } = useTranslation();

  return (
    <View style={styles.paySection}>
      <View style={styles.payHeader}>
        <Text style={styles.payTitle}>{t('contribution.pay_title')}</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onOpenPayCard}
          style={styles.payLinkRow}
          testID="contribution-pay-link"
        >
          <Text style={styles.payLinkText}>{t('contribution.pay_link')}</Text>
          <Image
            color={TEXT_DARK}
            height={ARROW_SIZE}
            name="send"
            type="svg"
            width={ARROW_SIZE}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.centerLabel}>{t('contribution.deposit_label')}</Text>
      <Text style={styles.bigAmount}>
        {t('contribution.deposit_amount', { amount: DEPOSIT_AMOUNT })}
      </Text>

      <View style={styles.payDivider} />

      <Text style={styles.centerLabel}>{t('contribution.point_label')}</Text>
      <Text style={styles.bigAmount}>
        {t('contribution.point_amount', { amount: POINT_AMOUNT })}
      </Text>

      <View style={styles.payActions}>
        <Button
          type="primary"
          title={t('contribution.pay_history')}
          style={{
            width: '35%',
          }}
        />
        <Button
          type="primary"
          title={t('contribution.pay_recharge')}
          style={{
            width: '35%',
          }}
        />
      </View>
    </View>
  );
}

function MenuRow({ label }: ContributionRowProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.menuRow}
      testID={`contribution-menu-${label}`}
    >
      <View style={styles.menuRowLeft}>
        <Image
          color={TEXT_DARK}
          height={CHEVRON_SIZE}
          name="ic_store"
          type="svg"
          width={CHEVRON_SIZE}
        />
        <Text style={styles.menuRowText}>{label}</Text>
      </View>
      <Image
        color="#B5B5B5"
        height={CHEVRON_SIZE}
        name="ic_chevron_right"
        type="svg"
        width={CHEVRON_SIZE}
      />
    </TouchableOpacity>
  );
}

function Contribution() {
  const { t } = useTranslation();
  const profile: ProfileType | undefined = useAppSelector(
    AccountSelector.getProfile,
  );

  const name = profile?.name ?? '쿠비';

  return (
    <View style={styles.safeArea}>
      <View style={styles.headerWrap}>
        <HeaderDetail
          transparent
          title={t('contribution.title')}
          style={{
            paddingHorizontal: 0,
          }}
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <NameBlock name={name} />
        <ContributionCard />
        <PaySection />
        <View style={styles.menuList}>
          <MenuRow label={t('contribution.menu_transaction')} />
        </View>
      </ScrollView>
    </View>
  );
}

export default Contribution;

const styles = StyleSheet.create({
  bigAmount: {
    color: TEXT_DARK,
    fontSize: ScaleSize(34),
    fontWeight: '800',
    marginTop: ScaleSize(4),
    textAlign: 'center',
  },
  centerLabel: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(13),
    textAlign: 'center',
  },
  contributionActions: {
    flexDirection: 'row',
    gap: ScaleSize(12),
    marginTop: ScaleSize(16),
  },
  contributionAmount: {
    color: '#FFFFFF',
    fontSize: ScaleSize(40),
    fontWeight: '800',
    marginTop: ScaleSize(4),
    textAlign: 'center',
  },
  contributionCard: {
    borderRadius: ScaleSize(4),
    overflow: 'hidden',
    paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(24),
  },
  contributionTitle: {
    color: '#FFFFFF',
    fontSize: ScaleSize(18),
    fontWeight: '700',
  },
  contributionTotalLabel: {
    color: '#FFFFFF',
    fontSize: ScaleSize(15),
    fontWeight: '700',
    marginTop: ScaleSize(36),
    textAlign: 'center',
  },
  darkPill: {
    alignItems: 'center',
    backgroundColor: DARK_PILL,
    borderRadius: ScaleSize(28),
    elevation: 4,
    flex: 1,
    height: ScaleSize(74),
    justifyContent: 'center',
    paddingHorizontal: ScaleSize(16),
    shadowColor: '#000000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  darkPillText: {
    color: '#FFFFFF',
    fontSize: ScaleSize(11),
    fontWeight: '600',
    textAlign: 'center',
  },
  greeting: {
    color: TEXT_DARK,
    flexShrink: 1,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerRight: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 1,
    gap: ScaleSize(10),
  },
  headerWrap: {
    backgroundColor: '#F2F2F2',
    paddingBottom: ScaleSize(12),
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(8),
  },
  menuList: {
    backgroundColor: '#FFFFFF',
    marginTop: ScaleSize(8),
  },
  menuRow: {
    alignItems: 'center',
    borderTopColor: '#EFEFEF',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(18),
  },
  menuRowLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(12),
  },
  menuRowText: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '500',
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ScaleSize(12),
    marginTop: ScaleSize(10),
  },
  metaText: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(12),
  },
  name: {
    color: TEXT_DARK,
    fontSize: ScaleSize(18),
    fontWeight: '700',
  },
  nameBlock: {
    paddingBottom: ScaleSize(16),
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(8),
  },
  payActions: {
    flexDirection: 'row',
    gap: ScaleSize(16),
    marginTop: ScaleSize(20),
    justifyContent: 'center',
  },
  payDivider: {
    backgroundColor: '#E0E0E0',
    height: 1,
    marginVertical: ScaleSize(20),
  },
  payHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ScaleSize(16),
  },
  payLinkRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(8),
  },
  payLinkText: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
  },
  paySection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(24),
  },
  payTitle: {
    color: TEXT_DARK,
    fontSize: ScaleSize(20),
    fontWeight: '700',
  },
  safeArea: {
    backgroundColor: '#F2F2F2',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: ScaleSize(32),
  },
  whitePill: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: ScaleSize(24),
    elevation: 3,
    // flex: 1,
    justifyContent: 'center',
    paddingHorizontal: ScaleSize(12),
    paddingVertical: ScaleSize(14),
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    width: '35%',
  },
  whitePillText: {
    color: TEXT_DARK,
    fontSize: ScaleSize(12),
    fontWeight: '500',
  },
});
