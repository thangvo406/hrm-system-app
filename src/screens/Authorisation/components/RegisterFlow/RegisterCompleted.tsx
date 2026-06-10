import { Button } from '@components';
import Image from '@components/Image';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ScaleSize } from '@kits/core';

const BANNER_HEIGHT = ScaleSize(30);
const BANNER_WIDTH = ScaleSize(68);
const TEXT_COLOR = '#1A1A1A';

export type MembershipOption = {
  readonly id: string;
  readonly label: string;
};

type ChooseMemberShipTypeProps = {
  readonly disabled?: boolean;
  readonly onSubmit: () => void;
  readonly selectedMembershipId?: string;
};

function RegisterCompleted({
  disabled = false,
  onSubmit,
  selectedMembershipId = undefined,
}: ChooseMemberShipTypeProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          height={BANNER_HEIGHT}
          name="ic_logo_banner"
          width={BANNER_WIDTH}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.desc}>{t('register_completed.desc')}</Text>
      </View>

      <View style={styles.footer}>
        <View
          style={{
            width: '100%',
            height: ScaleSize(10),
            backgroundColor: '#F0F0F0',
            marginBottom: ScaleSize(30),
          }}
        />
        <Button
          disabled={disabled || !selectedMembershipId}
          onPress={onSubmit}
          style={{
            width: '90%',
            alignSelf: 'center',
          }}
          testID="choose-membership-next"
          title={t('choose_membership.next')}
          type="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  footer: {
    paddingBottom: ScaleSize(24),
    paddingTop: ScaleSize(12),
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingBottom: ScaleSize(10),
    paddingTop: ScaleSize(16),
  },
  desc: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(26),
    textAlign: 'center',
    // fontWeight: '700',
    // marginBottom: ScaleSize(40),
  },
});

export default React.memo(RegisterCompleted);
