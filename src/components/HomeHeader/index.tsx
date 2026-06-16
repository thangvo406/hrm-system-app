import { useTranslation } from 'react-i18next';
import type { Profile } from '@services/request/account';
import Image from '@components/Image';
import imageNames from '@assets/images/names';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { ScaleSize } from '@kits/core';

type HeaderProps = {
  readonly onOpenMenu: () => void;
  readonly onPressNotification?: () => void;
  readonly profile?: Profile;
  readonly isShowLabelMember?: boolean;
};

const ICON_SIZE = 24;
const LOGO_WIDTH = 96;
const LOGO_HEIGHT = 42;
const PRIMARY_COLOR = '#5BB85C';

function Header({
  onOpenMenu,
  onPressNotification = undefined,
  profile = undefined,
  isShowLabelMember = false,
}: HeaderProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={onOpenMenu} testID="home-menu-button">
          <Image
            color="#1A1A1A"
            height={ICON_SIZE}
            name="ic_menu"
            type="svg"
            width={ICON_SIZE}
          />
        </TouchableOpacity>
        <Image
          height={LOGO_HEIGHT}
          name={imageNames.ic_logo_banner}
          type="image"
          width={LOGO_WIDTH}
        />
        {isShowLabelMember ? (
          <View style={styles.memberBadge}>
            <Text style={styles.memberBadgeText}>{t('home.member_label')}</Text>
          </View>
        ) : undefined}
      </View>

      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <Text style={styles.greeting}>
          {t('home.greeting')}
          <Text style={styles.name}> {` ${profile?.fullName}`}</Text>
          {` ${t('home.greeting_prefix')}`}
        </Text>
        <TouchableOpacity
          onPress={onPressNotification}
          testID="home-notification-button"
          style={{
            marginTop: ScaleSize(-5),
          }}
        >
          <Image
            height={ICON_SIZE}
            name={imageNames.ic_bell_green}
            width={ICON_SIZE}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  greeting: {
    color: '#707070',
    fontSize: 15,
    fontWeight: '600',
    marginRight: ScaleSize(10),
  },
  name: {
    color: '#1A1A1A',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  memberBadge: {
    alignSelf: 'center',
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 14,
    marginLeft: -ScaleSize(8),
    paddingHorizontal: 10,
    paddingVertical: 2,
    top: -10,
  },
  memberBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default React.memo(Header);
