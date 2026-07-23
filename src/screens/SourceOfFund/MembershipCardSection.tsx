import type { SourceCard } from '@hooks/useSourceOfFund';

import { ScaleSize } from '@kits/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';

import CardCarousel from './CardCarousel';

type Properties = {
  readonly cards: readonly SourceCard[];
  readonly initialIndex: number;
  readonly isShowUnRegister: boolean;
};

function MembershipCardSection({
  cards,
  initialIndex,
  isShowUnRegister,
}: Properties) {
  const { t } = useTranslation();

  if(isShowUnRegister) {
    return <></>
  }
  return (
    <>
      {!isShowUnRegister && (
        <Text style={styles.label}>{t('source_of_fund.card')}</Text>
      )}
      <CardCarousel cards={cards} initialIndex={initialIndex} />
    </>
  );
}

export default React.memo(MembershipCardSection);

const styles = StyleSheet.create({
  label: {
    color: '#1A1A1A',
    fontSize: ScaleSize(14),
    fontWeight: '700',
    marginBottom: ScaleSize(14),
    marginTop: ScaleSize(16),
    paddingHorizontal: ScaleSize(20),
  },
});
