import type { ListRenderItem } from 'react-native';
import type { Survey } from '@hooks';

import { FlatList, StyleSheet, View } from 'react-native';
import { HeaderDetail } from '@components';
import { ScaleSize } from '@kits/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSurvey } from '@hooks';
import { useTranslation } from 'react-i18next';

import ItemSeparator from './ItemSeparator';
import SurveyRow from './SurveyRow';

const BACKGROUND_COLOR = '#FFFFFF';

const keyExtractor = (item: Survey) => String(item.id);

function Survey() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data, onLoadMore, onPressViewResult, onPressStart } = useSurvey();

  const renderItem: ListRenderItem<Survey> = ({ item }) => (
    <SurveyRow
      item={item}
      onPressViewResult={onPressViewResult}
      onPressStart={onPressStart}
    />
  );

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <HeaderDetail title={t('survey.title')} />
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
