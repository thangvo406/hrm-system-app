import type { RootScreenProps } from '@navigation/types';

import { AnnouncementDetailLoading, HeaderDetail } from '@components';
import { useAnnouncementDetail } from '@hooks';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { Paths } from '@navigation/paths';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppNavigator from '@navigation/AppNavigator';
import { useTranslation } from 'react-i18next';

import Content from './Content';

const TEXT_MUTED = '#9E9E9E';

const onOpenMenu = () => {
  AppNavigator.showMenu();
};

const onPressHome = () => {
  AppNavigator.reset(Paths.Home);
};

const onPressNotification = () => {
  AppNavigator.navigate(Paths.Notifications);
};

function AnnouncementDetail({
  navigation,
  route,
}: RootScreenProps<Paths.AnnouncementDetail>) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data, loading, error } = useAnnouncementDetail({ route });

  const onPressBack = () => {
    navigation.goBack();
  };

  const renderBody = () => {
    if (loading) {
      return <AnnouncementDetailLoading />;
    }
    if (error || !data) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {error ?? 'No content available.'}
          </Text>
        </View>
      );
    }
    return (
      <Content
        contentHtml={data.content}
        createdDate={data.createdDate}
        title={data.title}
      />
    );
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <HeaderDetail
        onOpenMenu={onOpenMenu}
        onPressBack={onPressBack}
        onPressHome={onPressHome}
        onPressNotification={onPressNotification}
        title={t('announcement_detail.title')}
      />
      <View style={styles.body}>{renderBody()}</View>
    </View>
  );
}

export default AnnouncementDetail;

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: ScaleSize(48),
  },
  errorText: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(14),
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
});