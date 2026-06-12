import { Image } from '@components';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { ScaleSize } from '@kits/core';
import imageNames from '@assets/images/names';

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

const sections: readonly MenuSection[] = [
  {
    items: [
      { key: 'deposit_inquiry', labelKey: 'home.menu.deposit_inquiry' },
      { key: 'deposit_pay', labelKey: 'home.menu.deposit_pay' },
      { key: 'dividend_inquiry', labelKey: 'home.menu.dividend_inquiry' },
    ],
    titleKey: 'home.menu.section_life',
  },
  {
    items: [
      { key: 'payment_method', labelKey: 'home.menu.payment_method' },
      { key: 'pay', labelKey: 'home.menu.pay' },
      { key: 'pay_balance', labelKey: 'home.menu.pay_balance' },
    ],
    titleKey: 'home.menu.section_pay',
  },
  {
    items: [
      { key: 'order', labelKey: 'home.menu.order' },
      { key: 'store_search', labelKey: 'home.menu.store_search' },
    ],
    titleKey: 'home.menu.section_order',
  },
  {
    items: [
      { key: 'notice', labelKey: 'home.menu.notice' },
      { key: 'community', labelKey: 'home.menu.community' },
      { key: 'survey', labelKey: 'home.menu.survey' },
    ],
    titleKey: 'home.menu.section_community',
  },
  {
    items: [
      { key: 'profile', labelKey: 'home.menu.profile' },
      { key: 'security', labelKey: 'home.menu.security' },
      { key: 'notification', labelKey: 'home.menu.notification' },
    ],
    titleKey: 'home.menu.section_mypage',
  },
];

export type MenuProperties = {
  readonly onClose: () => void;
  readonly onItemPress: (itemKey: string) => void;
  readonly onLogout: () => void;
  readonly visible: boolean;
};

function Menu({ onClose, onItemPress, onLogout, visible }: MenuProperties) {
  const { t } = useTranslation();
  const progress = useSharedValue(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    progress.value = withTiming(visible ? 1 : 0, {
      duration: SLIDE_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value * BACKDROP_OPACITY,
  }));

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -(1 - progress.value) * TRANSLATE_HIDDEN }],
  }));

  if (!visible) return undefined;

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <Animated.View
        pointerEvents={visible ? 'auto' : 'none'}
        style={[styles.backdrop, backdropStyle]}
      >
        <TouchableOpacity
          accessibilityLabel="menu-dismiss"
          accessibilityRole="button"
          activeOpacity={0.7}
          hitSlop={HIT_SLOP_LARGE}
          onPress={onClose}
          style={styles.backdropPressable}
          testID="menu-backdrop"
        />
      </Animated.View>

      <Animated.View style={[styles.panel, panelStyle]} testID="menu-panel">
        <View style={styles.safeArea}>
          <View style={[styles.headerWrap, { paddingTop: insets.top }]}>
            <View style={styles.header}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoText}>{LOGO_INITIALS}</Text>
              </View>
              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.7}
                hitSlop={HIT_SLOP_SMALL}
                onPress={onLogout}
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
                        onItemPress(item.key);
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
