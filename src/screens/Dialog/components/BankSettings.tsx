import type { IconName } from '@assets/icons';

import { AppButton, Button, Image } from '@components';
import { ScaleSize } from '@kits/core';
import { IAccount } from '@type';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

const ICON_SIZE = ScaleSize(24);
const TITLE_INK = '#1A1A1A';
const DESC_INK = '#9AA0A6';
const HAIRLINE = '#EFEFEF';

function OptionRow({
  description,
  icon,
  showDivider = false,
  testID,
  title,
  onPress,
}: {
  readonly description: string;
  readonly icon: IconName;
  readonly showDivider?: boolean;
  readonly testID: string;
  readonly title: string;
  readonly onPress?: () => void;
}) {
  return (
    <View>
      <AppButton onPress={onPress} style={styles.option} testID={testID}>
        <View style={styles.iconSlot}>
          <Image
            color={TITLE_INK}
            height={ICON_SIZE}
            name={icon}
            type="svg"
            width={ICON_SIZE}
          />
        </View>
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>{title}</Text>
          <Text style={styles.optionDesc}>{description}</Text>
        </View>
      </AppButton>
      {showDivider ? <View style={styles.divider} /> : undefined}
    </View>
  );
}

type Properties = {
  readonly onLock?: () => void;
  readonly onRequestClose?: () => void;
  readonly onSetDefault?: () => void;
  readonly onUnLock?: () => void;
  readonly isLocked: boolean;
  readonly card: IAccount;
};

/**
 * Settings sheet for one saved payment method: lock it, or unlink it from the
 * wallet. Rendered inside the bottom-sheet host, which supplies the white
 * card, drag handle and bottom inset.
 */
function BankSettings({
  onLock,
  onRequestClose,
  isLocked,
  onUnLock,
  onSetDefault,
  card,
}: Properties) {
  const { t } = useTranslation();

  const wallet = t('account_management.wallet_name');

  const { desc, iconLock, titleLock } = useMemo((): {
    desc: string;
    iconLock: IconName;
    titleLock: string;
  } => {
    if (isLocked) {
      return {
        desc: t('account_management.bank_settings.unlock_desc', {
          wallet,
        }),
        iconLock: 'ic_unlock',
        titleLock: t('account_management.bank_settings.unlock_title'),
      };
    } else {
      return {
        desc: t('account_management.bank_settings.lock_desc', {
          wallet,
        }),
        iconLock: 'ic_lock_closed',
        titleLock: t('account_management.bank_settings.lock_title'),
      };
    }
  }, [isLocked, wallet]);

  const onPressLock = () => {
    onRequestClose?.();
    if (isLocked) {
      onUnLock?.();
    } else {
      onLock?.();
    }
  };

  const onPressSetDefault = () => {
    onRequestClose?.();
    onSetDefault?.();
  };

  return (
    <View style={styles.container} testID="bank-settings-sheet">
      <Text style={styles.title}>
        {t('account_management.bank_settings.title')}
      </Text>
      <OptionRow
        description={desc}
        icon={iconLock}
        onPress={onPressLock}
        showDivider
        testID="bank-settings-lock"
        title={titleLock}
      />
      {!card?.default && (
        <OptionRow
          description={t('account_management.bank_settings.set_default_desc', {
            wallet,
          })}
          icon="ic_star"
          onPress={onPressSetDefault}
          testID="bank-settings-set-default"
          title={t('account_management.bank_settings.set_default_title')}
        />
      )}

      <Button
        onPress={onRequestClose}
        style={styles.close}
        testID="bank-settings-close"
        title={t('account_management.bank_settings.close')}
        type="outline-green"
      />
    </View>
  );
}

export default React.memo(BankSettings);

const styles = StyleSheet.create({
  close: {
    height: ScaleSize(50),
    marginTop: ScaleSize(16),
  },
  container: {
    paddingHorizontal: ScaleSize(20),
    width: '100%',
  },
  divider: {
    backgroundColor: HAIRLINE,
    height: ScaleSize(1),
  },
  iconSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    width: ICON_SIZE,
  },
  title: {
    color: '#1A1A1A',
    fontSize: ScaleSize(17),
    fontWeight: '700',
    paddingHorizontal: ScaleSize(8),
    marginBottom: ScaleSize(10),
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(16),
    paddingVertical: ScaleSize(18),
  },
  optionDesc: {
    color: DESC_INK,
    fontSize: ScaleSize(15),
    lineHeight: ScaleSize(22),
  },
  optionText: {
    flex: 1,
    gap: ScaleSize(4),
  },
  optionTitle: {
    color: TITLE_INK,
    fontSize: ScaleSize(17),
    fontWeight: '700',
  },
});
