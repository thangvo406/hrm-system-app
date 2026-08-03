import { useTranslation } from 'react-i18next';
import type { Profile } from '@services/request/account';
import Image from '@components/Image';
import imageNames from '@assets/images/names';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { ScaleSize } from '@kits/core';
import { AppConstants } from '@constants';
import AppButton from '@components/AppButton';
import {
  GRADE_MEMBERSHIP_TYPE,
  MEMBER_SHIP_TYPE_HOME,
} from '@constants/config';

type HeaderProps = {
  readonly onOpenMenu: () => void;
  readonly onPressNotification?: () => void;
  readonly profile?: Profile;
  readonly hideIconNotify?: boolean;
  readonly isShowLabelMember?: boolean;
};

const ICON_SIZE = 24;
const LOGO_WIDTH = 96;
const LOGO_HEIGHT = 42;
const PRIMARY_COLOR = '#5BB85C';

function Header({
  onOpenMenu,
  onPressNotification,
  profile,
  isShowLabelMember,
  hideIconNotify,
}: HeaderProps) {
  const { t } = useTranslation();

  const config =
    MEMBER_SHIP_TYPE_HOME[profile?.coopMemberGrade || ''] ||
    MEMBER_SHIP_TYPE_HOME[GRADE_MEMBERSHIP_TYPE.GENERAL];
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <AppButton onPress={onOpenMenu} testID="home-menu-button">
          <Image
            color="#1A1A1A"
            height={ICON_SIZE}
            name="ic_menu"
            type="svg"
            width={ICON_SIZE}
          />
        </AppButton>
        <Image
          height={LOGO_HEIGHT}
          name={imageNames.ic_logo_banner}
          type="image"
          width={LOGO_WIDTH}
        />
        {isShowLabelMember ? (
          <View
            style={[
              styles.memberBadge,
              { backgroundColor: config.backgroundColor },
            ]}
          >
            <Text
              style={[
                styles.memberBadgeText,
                { padding: 3, color: config.color },
              ]}
            >
              {t(
                `home.member_labels.${profile?.coopMemberGrade?.toLowerCase()}`,
              )}
            </Text>
          </View>
        ) : undefined}
      </View>

      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <Text style={styles.greeting} numberOfLines={1}>
          <Text style={styles.name}> {` ${profile?.universityName}`}</Text>
        </Text>
        <AppButton
          onPress={onPressNotification}
          testID="home-notification-button"
          hitSlop={AppConstants.HISLOP_BUTTON}
          style={{
            marginTop: ScaleSize(-5),
          }}
        >
          <Image
            height={ICON_SIZE}
            name={imageNames.ic_swap}
            width={ICON_SIZE}
          />
        </AppButton>
        {!hideIconNotify ? (
          <AppButton
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
          </AppButton>
        ) : undefined}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  greeting: {
    color: '#707070',
    fontSize: ScaleSize(12),
    fontWeight: '600',
    marginRight: ScaleSize(10),
    width: ScaleSize(90),
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
