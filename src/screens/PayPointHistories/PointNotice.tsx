import { AppButton, Image } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Colors } from '@constants';

type Properties = {
  readonly amount?: number;
  readonly onDismiss?: () => void;
};

const ICON_SIZE = ScaleSize(18);
const BANNER_BG = '#FEF6E1';
const BANNER_ICON = '#E0A73B';
const INFO_ICON = '#9AA0A6';
const TEXT_DARK = '#3D3D3D';
const TEXT_MUTED = '#8A8F94';

function PointNotice({ amount, onDismiss }: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Image
          color={BANNER_ICON}
          height={ICON_SIZE}
          name="ic_info"
          type="svg"
          width={ICON_SIZE}
          style={{
            transform: [
              {
                rotate: '180deg',
              },
            ],
          }}
        />
        <Text style={styles.bannerText}>
          {t('pay_point.expire_banner', { amount, days: 30 })}
        </Text>
        <AppButton onPress={onDismiss} testID="pay-point-notice-confirm">
          <Text style={styles.confirmText}>{`[${t(
            'pay_point.confirm',
          )}]`}</Text>
        </AppButton>
      </View>

      <View style={styles.infoRow}>
        <Image
          color={INFO_ICON}
          height={ScaleSize(16)}
          name="ic_info"
          type="svg"
          width={ScaleSize(16)}
        />
        <Text style={styles.infoText}>{t('pay_point.auto_use_info')}</Text>
      </View>
    </View>
  );
}

export default React.memo(PointNotice);

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    backgroundColor: BANNER_BG,
    borderRadius: ScaleSize(10),
    flexDirection: 'row',
    gap: ScaleSize(8),
    paddingHorizontal: ScaleSize(14),
    paddingVertical: ScaleSize(12),
  },
  bannerText: {
    color: TEXT_DARK,
    flex: 1,
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
  confirmText: {
    color: Colors.primary,
    fontSize: ScaleSize(13),
    fontWeight: '600',
  },
  container: {
    paddingHorizontal: ScaleSize(16),
    paddingTop: ScaleSize(14),
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(6),
    paddingHorizontal: ScaleSize(4),
    paddingVertical: ScaleSize(12),
    marginLeft: ScaleSize(10),
    marginTop: ScaleSize(10),
  },
  infoText: {
    color: TEXT_MUTED,
    flex: 1,
    fontSize: ScaleSize(12),
  },
});
