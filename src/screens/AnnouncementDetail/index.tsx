import type { RootScreenProps } from '@navigation/types';

import { AnnouncementDetailLoading, HeaderDetail } from '@components';
import { useAnnouncementDetail } from '@hooks';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { Paths } from '@navigation/paths';
import { useTranslation } from 'react-i18next';

import Content from './Content';

const TEXT_MUTED = '#9E9E9E';

function AnnouncementDetail(props: RootScreenProps<Paths.AnnouncementDetail>) {
  const { t } = useTranslation();
  const { data, loading, error, hideBtnNotify } = useAnnouncementDetail(props);


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
    <View style={styles.safeArea}>
      <HeaderDetail
        hideNotify={hideBtnNotify}
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
