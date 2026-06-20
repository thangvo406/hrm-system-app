import type { ListRenderItem } from 'react-native';
import type { Survey } from '@hooks';

import { FlatList, StyleSheet, View } from 'react-native';
import { HeaderDetail } from '@components';
import { ScaleSize } from '@kits/core';
import { useSurvey } from '@hooks';
import { useTranslation } from 'react-i18next';

import ItemSeparator from './ItemSeparator';
import SurveyRow from './SurveyRow';
import { EmptyView } from '@components';
import imageNames from '@assets/images/names';

const BACKGROUND_COLOR = '#FFFFFF';

const keyExtractor = (item: Survey) => String(item.id);

function Survey() {
  const { t } = useTranslation();
  const { data, onLoadMore, onPressViewResult, onPressStart } = useSurvey();

  const renderItem: ListRenderItem<Survey> = ({ item }) => (
    <SurveyRow
      item={item}
      onPressViewResult={onPressViewResult}
      onPressStart={onPressStart}
    />
  );

  return (
    <View style={styles.safeArea}>
      <HeaderDetail title={t('survey.title')} />
      {data?.length > 0 ? (
        <FlatList
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={styles.listContent}
          data={data}
          keyExtractor={keyExtractor}
          onEndReached={onLoadMore}
          onEndReachedThreshold={2.1}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyView
          icon={imageNames.ic_survey_gray}
          desc={t('common.no_data')}
        />
      )}
    </View>
  );
}

export default Survey;

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: ScaleSize(32),
  },
  safeArea: {
    backgroundColor: BACKGROUND_COLOR,
    flex: 1,
  },
});
