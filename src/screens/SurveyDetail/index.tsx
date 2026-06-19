import type { IQuestion } from '@hooks';
import type { ListRenderItem } from 'react-native';
import type { Paths } from '@navigation/paths';
import type { RootScreenProps } from '@navigation/types';

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { HeaderDetail } from '@components';
import { ScaleSize } from '@kits/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSurveyDetail } from '@hooks';
import { useTranslation } from 'react-i18next';

import ItemSeparator from './ItemSeparator';
import QuestionItem from './QuestionItem';
import TitleRow from './TitleRow';

const BACKGROUND_COLOR = '#FFFFFF';
const SUBMIT_BG = '#1A1A1A';
const TEXT_MUTED = '#9E9E9E';

const keyExtractor = (item: IQuestion) => String(item.id);

function SurveyDetail(props: RootScreenProps<Paths.SurveyDetail>) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { answers, data, error, loading, onSelectOption, onSubmit, submitting } =
    useSurveyDetail(props);

  const renderItem: ListRenderItem<IQuestion> = ({ index, item }) => (
    <QuestionItem
      index={index}
      onSelectOption={onSelectOption}
      question={item}
      selectedAnswerId={answers[item.id]}
    />
  );

  const renderBody = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator color={SUBMIT_BG} />
        </View>
      );
    }
    if (error || !data) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error ?? 'No content available.'}</Text>
        </View>
      );
    }
    return (
      <FlatList
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={<TitleRow data={data} />}
        contentContainerStyle={styles.listContent}
        data={data.questions}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <HeaderDetail title={t('survey_detail.title')} />
      {renderBody()}
      {data ? (
        <View
          style={[
            styles.submitBar,
            { paddingBottom: insets.bottom + ScaleSize(12) },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={submitting}
            onPress={onSubmit}
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            testID="survey-detail-submit"
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitLabel}>{t('survey_detail.submit')}</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : undefined}
    </View>
  );
}

export default SurveyDetail;

const styles = StyleSheet.create({
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
  listContent: {
    paddingBottom: ScaleSize(24),
  },
  safeArea: {
    backgroundColor: BACKGROUND_COLOR,
    flex: 1,
  },
  submitBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#F0F0F0',
    borderTopWidth: 1,
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(12),
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: SUBMIT_BG,
    borderRadius: ScaleSize(8),
    height: ScaleSize(52),
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitLabel: {
    color: '#FFFFFF',
    fontSize: ScaleSize(16),
    fontWeight: '600',
  },
});
