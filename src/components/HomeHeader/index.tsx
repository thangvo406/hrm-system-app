import { useTranslation } from 'react-i18next';
import type { Profile } from '@services/request/account';
import Image from '@components/Image';
import imageNames from '@assets/images/names';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

type HeaderProps = {
  readonly onOpenMenu: () => void;
  readonly profile?: Profile;
};

const ICON_SIZE = 24;
const LOGO_WIDTH = 96;
const LOGO_HEIGHT = 42;

function Header({ onOpenMenu, profile = undefined }: HeaderProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.header}>
      <Image
        height={LOGO_HEIGHT}
        name={imageNames.ic_logo_banner}
        type="image"
        width={LOGO_WIDTH}
      />
      <View style={styles.headerRight}>
        <Text style={styles.greeting}>
          {t('home.greeting', { name: profile?.name ?? '' })}
        </Text>
        <Image
          height={ICON_SIZE}
          name={imageNames.ic_user_fill}
          width={ICON_SIZE}
        />
        <TouchableOpacity onPress={onOpenMenu} testID="home-menu-button">
          <Image
            color="#1A1A1A"
            height={ICON_SIZE}
            name="ic_menu"
            type="svg"
            width={ICON_SIZE}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  greeting: {
    color: '#3D3D3D',
    fontSize: 18,
    fontWeight: '700',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerWrap: {
    backgroundColor: '#F2F2F2',
    paddingBottom: 12,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerRight: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
});

export default React.memo(Header);
