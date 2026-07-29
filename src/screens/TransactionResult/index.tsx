import type { RootScreenProps } from '@navigation/types';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import RegisterHeader from '@screens/Authorisation/components/RegisterFlow/Header';
import Contribute from './components/Contribute';
import TopUp from './components/TopUp';
import type { ComponentType } from 'react';
import { useMemo } from 'react';

const TEXT_DARK = '#1A1A1A';
const TEXT_MUTED = '#6B6B6B';
const SCREEN_BG = '#F5F5F5';
const CARD_BG = '#FFFFFF';
const ICON_SIZE = ScaleSize(74);

const onPressBack = () => {
  AppNavigator.goBack();
};

type RowProps = {
  readonly label: string;
  readonly value: string;
};

function Row({ label, value }: RowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function TransactionResult(props: RootScreenProps<Paths.TransactionResult>) {
  const insets = useSafeAreaInsets();
  const params = AppNavigator.getParams(props) || {};

  const DetailComponent = useMemo(() => {
    const screens: Record<string, ComponentType<any>> = {
      contribute: Contribute,
      topUp: TopUp,
    };
    return screens[params?.type] || TopUp;
  }, [params?.type]);

  return (
    <View style={styles.container}>
      <View style={[styles.body, { paddingTop: insets.top }]}>
        <RegisterHeader onBack={onPressBack} />
        <DetailComponent {...params} />
      </View>
    </View>
  );
}

export default TransactionResult;

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  confirmBtn: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: ScaleSize(28),
    height: ScaleSize(52),
    justifyContent: 'center',
    width: '100%',
  },
  confirmBtnText: {
    color: Colors.white,
    fontSize: ScaleSize(16),
    fontWeight: '600',
  },
  container: {
    backgroundColor: SCREEN_BG,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(28),
  },
  detailCard: {
    alignSelf: 'stretch',
    backgroundColor: CARD_BG,
    borderRadius: ScaleSize(16),
    marginTop: ScaleSize(24),
    paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(8),
  },
  footer: {
    backgroundColor: SCREEN_BG,
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(12),
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: (ICON_SIZE + 40) / 2,
    height: ICON_SIZE + 40,
    justifyContent: 'center',
    marginBottom: ScaleSize(20),
    width: ICON_SIZE + 40,
  },
  infoBox: {
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    borderRadius: ScaleSize(12),
    flexDirection: 'row',
    gap: ScaleSize(10),
    marginTop: ScaleSize(24),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(16),
  },
  infoTextCol: {
    flex: 1,
    gap: ScaleSize(6),
  },
  infoTextMuted: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(13),
    lineHeight: ScaleSize(18),
    marginTop: ScaleSize(2),
  },
  infoTextStrong: {
    fontSize: ScaleSize(14),
    fontWeight: '500',
    lineHeight: ScaleSize(20),
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: ScaleSize(12),
  },
  rowLabel: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(14),
  },
  rowValue: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '600',
  },
  statusBadge: {
    borderRadius: ScaleSize(6),
    paddingHorizontal: ScaleSize(10),
    paddingVertical: ScaleSize(4),
  },
  statusBadgeText: {
    fontSize: ScaleSize(13),
    fontWeight: '700',
  },
  subtitle: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(15),
    lineHeight: ScaleSize(20),
    marginTop: ScaleSize(8),
    textAlign: 'center',
  },
  title: {
    color: TEXT_DARK,
    fontSize: ScaleSize(24),
    fontWeight: '700',
    marginTop: ScaleSize(4),
    textAlign: 'center',
  },
});
