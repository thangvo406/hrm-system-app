import { Button, Image } from '@components';
import { ScaleSize } from '@kits/core';
import RegisterHeader from '@screens/Authorisation/components/RegisterFlow/Header';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import BankInfoCard from './BankInfoCard';
import { IManualTransfer } from '@type';

const TITLE_COLOR = '#2E8540';
const INTRO_COLOR = '#4B5563';

const HERO_HEIGHT = ScaleSize(122);
const HERO_WIDTH = ScaleSize(230);
const BURST_SIZE = ScaleSize(18);

type BankInformationViewProps = {
  readonly btnSubmit?: string;
  readonly disabled?: boolean;
  readonly onBack?: () => void;
  readonly onSubmit: () => void;
  readonly showBtnBack?: boolean;
  readonly titleBtn?: string;
  readonly title?: string;
  readonly desc?: string;
  readonly data?: IManualTransfer;
};

function BankInformationView({
  btnSubmit,
  disabled = false,
  onBack,
  onSubmit,
  showBtnBack,
  data,
  title,
  desc,
  titleBtn = 'bank_information.next',
}: BankInformationViewProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <RegisterHeader onBack={onBack} showBtnBack={showBtnBack} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image
          height={HERO_HEIGHT}
          name="ic_header_bank_info"
          style={styles.hero}
          width={HERO_WIDTH}
        />

        <View style={styles.titleRow}>
          <Image
            color={TITLE_COLOR}
            height={BURST_SIZE}
            name="ic_burst"
            type="svg"
            width={BURST_SIZE}
          />
          <Text style={styles.title}>
            {title || t('bank_information.transfer_title')}
          </Text>
          <Image
            color={TITLE_COLOR}
            height={BURST_SIZE}
            name="ic_burst"
            style={styles.burstRight}
            type="svg"
            width={BURST_SIZE}
          />
        </View>

        <Text style={styles.intro}>
          {desc || t('bank_information.transfer_desc')}
        </Text>
        <BankInfoCard data={data} />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          disabled={disabled}
          onPress={onSubmit}
          style={styles.submitButton}
          testID="bank-information-next"
          title={btnSubmit || t(titleBtn)}
          type="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  burstRight: {
    transform: [{ scaleX: -1 }],
  },
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  footer: {
    paddingBottom: ScaleSize(24),
    paddingTop: ScaleSize(12),
  },
  hero: {
    alignSelf: 'center',
    marginTop: ScaleSize(24),
  },
  intro: {
    color: INTRO_COLOR,
    fontSize: ScaleSize(15),
    lineHeight: ScaleSize(23),
    marginBottom: ScaleSize(24),
    marginTop: ScaleSize(10),
    textAlign: 'center',
  },
  scrollContent: {
    // paddingBottom: ScaleSize(16),
    paddingHorizontal: ScaleSize(20),
  },
  submitButton: {
    alignSelf: 'center',
    width: '90%',
  },
  title: {
    color: TITLE_COLOR,
    fontSize: ScaleSize(23),
    fontWeight: '800',
    textAlign: 'center',
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(10),
    justifyContent: 'center',
    marginTop: ScaleSize(18),
  },
});

export default React.memo(BankInformationView);
