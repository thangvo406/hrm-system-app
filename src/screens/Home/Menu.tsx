import { AppButton, Image, ProgressiveImage } from '@components';
import { useTranslation } from 'react-i18next';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScaleSize } from '@kits/core';
import imageNames from '@assets/images/names';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import { logout } from '@services/slices/auth/authSlice';
import { AppStacks, Paths } from '@navigation/paths';
import AppNavigator from '@navigation/AppNavigator';
import Information from '@screens/Dialog/components/Information';
import { useI18n } from '@hooks';
import RegisterMembership from '@dialogs/RegisterMembership';
import RequestAddCard from '@dialogs/RequestAddCard';
import { GRADE_MEMBERSHIP_TYPE } from '@constants/config';
import set from 'lodash/set';

const MENU_WIDTH_RATIO = 0.78;
const SLIDE_DURATION = 280;
const BACKDROP_OPACITY = 0.45;
const LOGO_SIZE = ScaleSize(64);
const LOGOUT_ICON_SIZE = ScaleSize(22);
const HEADER_HORIZONTAL = ScaleSize(20);
const HEADER_VERTICAL = ScaleSize(20);
const SECTION_TITLE_SIZE = ScaleSize(16);
const ITEM_TEXT_SIZE = ScaleSize(15);
const ITEM_VERTICAL = ScaleSize(10);
const SECTION_GAP = ScaleSize(22);
const DIVIDER_HEIGHT = 1;
const SECTION_TITLE_COLOR = '#1A1A1A';
const ITEM_COLOR = '#1A1A1A';
const DASH_COLOR = '#9E9E9E';
const HEADER_BACKGROUND = '#4FAA52';
const LOGO_TEXT = '#FFFFFF';
const LOGOUT_TEXT = '#FFFFFF';
const LOGO_INITIALS = '쿠비';
const NAME_CENTER_MAX_LENGTH = 7;
const TRANSLATE_HIDDEN = 1000;
const HIT_SLOP_SMALL = {
  bottom: 8,
  left: 8,
  right: 8,
  top: 8,
} as const;
const HIT_SLOP_LARGE = {
  bottom: 16,
  left: 16,
  right: 16,
  top: 16,
} as const;

type MenuItem = {
  readonly key: string;
  readonly labelKey: string;
};

type MenuSection = {
  readonly items: readonly MenuItem[];
  readonly titleKey: string;
};

const NAV_TARGETS: Readonly<Record<string, Paths>> = {
  notice: Paths.Announcements,
  pay_balance: Paths.ContributionHistory,
  survey: Paths.Survey,
  store_search: Paths.Stores,
  order: Paths.Stores,
  order_history: Paths.Orders,
  pay: Paths.PaymentOffline,
  deposit_inquiry: Paths.ContributionHistory,
  deposit_pay: Paths.ContributionInput,
  profile: Paths.Profile,
  coupon: Paths.Vouchers,
  meal_ticket: Paths.MealTickets,
  pay_point: Paths.PayPointHistories,
  pay_topup: Paths.TopUp,
};

const SECTIONS: readonly MenuSection[] = [
  {
    items: [
      { key: 'deposit_inquiry', labelKey: 'home.menu.deposit_inquiry' },
      { key: 'deposit_pay', labelKey: 'home.menu.deposit_pay' },
      { key: 'coupon', labelKey: 'home.menu.coupon' },
      { key: 'meal_ticket', labelKey: 'home.menu.meal_ticket' },
    ],
    titleKey: 'home.menu.section_life',
  },
  {
    items: [
      { key: 'pay_point', labelKey: 'home.menu.pay_point' },
      // { key: 'pay_register', labelKey: 'home.menu.pay_register' },
      { key: 'pay_topup', labelKey: 'home.menu.pay_topup' },
      { key: 'pay', labelKey: 'home.menu.pay' },
    ],
    titleKey: 'home.menu.section_pay',
  },
  {
    items: [
      { key: 'order', labelKey: 'home.menu.order' },
      { key: 'order_history', labelKey: 'home.menu.order_history' },
    ],
    titleKey: 'home.menu.section_order',
  },
  {
    items: [
      { key: 'notice', labelKey: 'home.menu.notice' },
      { key: 'survey', labelKey: 'home.menu.survey' },
    ],
    titleKey: 'home.menu.section_community',
  },
  {
    items: [
      { key: 'profile', labelKey: 'home.menu.profile' },
      {
        key: 'academy_verification',
        labelKey: 'home.menu.academy_verification',
      },
      { key: 'notification', labelKey: 'home.menu.notification' },
    ],
    titleKey: 'home.menu.section_mypage',
  },
];

export type MenuProperties = {
  readonly onRequestClose: () => void;
  readonly zIndex?: number;
};

function Menu({ onRequestClose, zIndex = undefined }: MenuProperties) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const progress = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const [closing, setClosing] = useState(false);
  const afterCloseReference = useRef<(() => void) | undefined>(undefined);
  const { toggleLanguage } = useI18n();
  const profile = useAppSelector(AccountSelector.getProfile);
  // Khi avatar load lỗi (link chết) thì fall back về chữ cái đầu của tên.
  const [avatarError, setAvatarError] = useState(false);

  const avatarUrl = profile?.avatar?.fileUrl;
  const showAvatar = !!avatarUrl && !avatarError;
  const profileName = profile?.name ?? profile?.fullName ?? '';
  const profileInitial =
    profileName.trim().charAt(0).toUpperCase() || LOGO_INITIALS;
  const displayName = profile?.fullName?.trim() ?? '';
  // Tên ngắn thì canh giữa theo avatar phía trên, tên dài canh trái như cũ.
  const isShortDisplayName = displayName.length <= NAME_CENTER_MAX_LENGTH;

  const sections = useMemo(() => {
    const isHideContribute =
      profile?.coopMemberGrade == GRADE_MEMBERSHIP_TYPE.GENERAL;
    const _sections = SECTIONS;
    let firstItem = _sections[0].items;
    if (isHideContribute) {
      firstItem = firstItem.filter(
        it => !['deposit_inquiry', 'deposit_pay'].includes(it.key),
      );
    }
    set(_sections, `[0].items`, firstItem);
    return _sections;
  }, []);

  useEffect(() => {
    if (closing) {
      progress.value = withTiming(0, {
        duration: SLIDE_DURATION,
        easing: Easing.in(Easing.cubic),
      });
      const timer = setTimeout(() => {
        onRequestClose();
        afterCloseReference.current?.();
      }, SLIDE_DURATION);
      return () => {
        clearTimeout(timer);
      };
    }
    progress.value = withTiming(1, {
      duration: SLIDE_DURATION,
      easing: Easing.out(Easing.cubic),
    });
    return undefined;
  }, [closing, onRequestClose, progress]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value * BACKDROP_OPACITY,
  }));

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -(1 - progress.value) * TRANSLATE_HIDDEN }],
  }));

  // Slide the panel out, then unmount via the host's close callback.
  const close = (afterClose?: () => void) => {
    afterCloseReference.current = afterClose;
    setClosing(true);
  };

  const handleItemPress = (itemKey: string) => {
    const target = NAV_TARGETS[itemKey];
    close(() => {
      if (target !== undefined) {
        AppNavigator.navigate(target, { menuKey: itemKey });
        return;
      } else if (itemKey == 'notification') {
        Linking.openSettings().catch(() => undefined);
      } else if (itemKey == 'academy_verification') {
        AppNavigator.showDialog({
          screen: RegisterMembership,
          isFullScreen: true,
        });
      } else if (itemKey == 'pay_register') {
        AppNavigator.showDialog({
          screen: RequestAddCard,
          isFullScreen: true,
        });
      } else {
        AppNavigator.showSnackBar({
          message: `menu.${itemKey}`,
          type: 'info',
        });
      }
    });
  };

  const handleLogout = () => {
    close(() => {
      AppNavigator.showDialog({
        screen: Information,
        title: t('home.logout.desc'),
        confirmTitle: t('home.logout.button_submit'),
        cancelTitle: t('home.logout.button_cancel'),
        onConfirm: () => {
          dispatch(logout());
          AppNavigator.reset(AppStacks.Auth, {
            screen: Paths.Authorization,
          });
        },
      });
    });
  };

  return (
    <View
      pointerEvents="box-none"
      style={[
        StyleSheet.absoluteFill,
        zIndex === undefined ? undefined : { zIndex },
      ]}
    >
      <Animated.View
        pointerEvents="auto"
        style={[styles.backdrop, backdropStyle]}
      >
        <TouchableOpacity
          accessibilityLabel="menu-dismiss"
          accessibilityRole="button"
          activeOpacity={0.7}
          hitSlop={HIT_SLOP_LARGE}
          onPress={() => {
            close();
          }}
          style={styles.backdropPressable}
          testID="menu-backdrop"
        />
      </Animated.View>

      <Animated.View style={[styles.panel, panelStyle]} testID="menu-panel">
        <View style={styles.safeArea}>
          <View style={[styles.headerWrap, { paddingTop: insets.top }]}>
            <View style={styles.header}>
              <AppButton
                style={styles.logoBadge}
                onLongPress={() => {
                  toggleLanguage();
                }}
              >
                {showAvatar ? (
                  <ProgressiveImage
                    height={LOGO_SIZE}
                    onError={() => {
                      setAvatarError(true);
                    }}
                    resizeMode="cover"
                    imageStyle={styles.avatarImage}
                    containerStyle={styles.avatarImage}
                    url={avatarUrl}
                    width={LOGO_SIZE}
                  />
                ) : (
                  <Text style={styles.logoText}>{profileInitial}</Text>
                )}
              </AppButton>
              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.7}
                hitSlop={HIT_SLOP_SMALL}
                onPress={handleLogout}
                style={styles.logoutButton}
                testID="menu-logout"
              >
                <Text style={styles.logoutText}>{t('home.menu.logout')}</Text>
                <Image
                  height={LOGOUT_ICON_SIZE}
                  name={imageNames.ic_logout_white}
                  width={LOGOUT_ICON_SIZE}
                />
              </TouchableOpacity>
            </View>
            {!!displayName && (
              <View
                style={
                  isShortDisplayName
                    ? styles.universityWrapCenter
                    : styles.universityWrapLeft
                }
              >
                <Text numberOfLines={1} style={styles.university}>
                  {displayName}
                </Text>
              </View>
            )}
            <View style={styles.headerDivider} />
          </View>

          <ScrollView
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
          >
            {sections.map(section => (
              <View key={section.titleKey} style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>{t(section.titleKey)}</Text>
                </View>
                <View style={styles.dashedLine} />
                <View style={styles.items}>
                  {section.items.map(item => (
                    <TouchableOpacity
                      accessibilityRole="button"
                      activeOpacity={0.7}
                      hitSlop={HIT_SLOP_SMALL}
                      key={item.key}
                      onPress={() => {
                        handleItemPress(item.key);
                      }}
                      style={styles.item}
                      testID={`menu-item-${item.key}`}
                    >
                      <Text style={styles.itemText}>{t(item.labelKey)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarImage: {
    borderRadius: LOGO_SIZE / 2,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  backdropPressable: {
    flex: 1,
  },
  body: {
    paddingBottom: ScaleSize(16),
    paddingHorizontal: HEADER_HORIZONTAL,
    paddingTop: ScaleSize(12),
  },
  dashedLine: {
    borderColor: DASH_COLOR,
    borderStyle: 'dashed',
    borderWidth: DIVIDER_HEIGHT,
    marginTop: ScaleSize(8),
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: HEADER_HORIZONTAL,
  },
  headerDivider: {
    backgroundColor: '#FFFFFF',
    borderRadius: DIVIDER_HEIGHT,
    height: ScaleSize(2),
    marginHorizontal: HEADER_HORIZONTAL,
    marginTop: HEADER_VERTICAL,
  },
  headerWrap: {
    backgroundColor: HEADER_BACKGROUND,
    paddingBottom: HEADER_VERTICAL,
    paddingTop: HEADER_VERTICAL,
  },
  item: {
    alignItems: 'flex-end',
    paddingVertical: ITEM_VERTICAL,
  },
  itemText: {
    color: ITEM_COLOR,
    fontSize: ITEM_TEXT_SIZE,
  },
  items: {
    marginTop: ScaleSize(8),
  },
  logoBadge: {
    alignItems: 'center',
    backgroundColor: LOGO_TEXT,
    borderRadius: LOGO_SIZE / 2,
    elevation: 4,
    height: LOGO_SIZE,
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    width: LOGO_SIZE,
  },
  logoText: {
    color: HEADER_BACKGROUND,
    fontSize: ScaleSize(20),
    fontWeight: '700',
  },
  logoutButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ScaleSize(10),
  },
  university: {
    color: LOGOUT_TEXT,
    fontSize: ScaleSize(16),
    fontWeight: '500',
    marginTop: ScaleSize(15),
  },
  // Rộng bằng đúng cột avatar (padding trái + avatar + padding phải) nên tâm
  // của wrapper trùng tâm avatar; minWidth để tên hơi dài không bị cắt.
  universityWrapCenter: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    minWidth: HEADER_HORIZONTAL * 2 + LOGO_SIZE,
  },
  universityWrapLeft: {
    marginLeft: ScaleSize(15),
  },
  logoutText: {
    color: LOGOUT_TEXT,
    fontSize: ScaleSize(16),
    fontWeight: '500',
  },
  panel: {
    backgroundColor: '#FFFFFF',
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: `${MENU_WIDTH_RATIO * 100}%`,
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  section: {
    marginBottom: SECTION_GAP,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  sectionTitle: {
    color: SECTION_TITLE_COLOR,
    fontSize: SECTION_TITLE_SIZE,
    fontWeight: '700',
  },
});

export default Menu;
