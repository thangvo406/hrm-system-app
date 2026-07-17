import type { IQuestion } from '@type/survey';
import type { ListRenderItem } from 'react-native';
import type { Paths } from '@navigation/paths';
import type { RootScreenProps } from '@navigation/types';

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppConstants } from '@constants';
import { Button, HeaderDetail } from '@components';
import { ScaleSize } from '@kits/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSurveyDetail } from '@hooks';
import { useTranslation } from 'react-i18next';

import ItemSeparator from './ItemSeparator';
import QuestionItem from './QuestionItem';
import TitleRow from './TitleRow';
import AppNavigator from '@navigation/AppNavigator';
import { DeviceUtils } from '@kits/core/utils';
const { ifAndroid } = DeviceUtils;
const BACKGROUND_COLOR = '#FFFFFF';
const SUBMIT_BG = '#1A1A1A';
const TEXT_MUTED = '#9E9E9E';

const keyExtractor = (item: IQuestion) => String(item.id);

function SurveyDetail(props: RootScreenProps<Paths.SurveyDetail>) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { isViewResult } = AppNavigator.getParams(props);
  const {
    answers,
    data,
    error,
    loading,
    onChangeTextAnswer,
    onSelectOption,
    onSubmit,
    submitting,
    textAnswers,
  } = useSurveyDetail(props);

  const renderItem: ListRenderItem<IQuestion> = ({ index, item }) => {
    const isShortAnswer = item.type === AppConstants.SURVEY_TYPE.SHORT_ANSWER;
    const isLocked = isShortAnswer
      ? !!item.selectedAnswerText
      : (item.selectedAnswerId ?? 0) > 0;
    return (
      <QuestionItem
        disabled={isLocked}
        isShortAnswer={isShortAnswer}
        index={index}
        onChangeTextAnswer={onChangeTextAnswer}
        onSelectOption={onSelectOption}
        question={item}
        selectedAnswerId={answers[item.id]}
        textAnswer={textAnswers[item.id]}
      />
    );
  };

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
          <Text style={styles.errorText}>
            {error ?? 'No content available.'}
          </Text>
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
    <View style={styles.safeArea}>
      <HeaderDetail title={t('survey_detail.title')} />
      {renderBody()}
      {!isViewResult && data ? (
        <View
          style={[
            styles.submitBar,
            {
              paddingBottom: ifAndroid(
                16,
                insets.bottom + (insets.bottom == 0 ? 20 : 0),
              ),
            },
          ]}
        >
          <Button
            title={t('survey_detail.submit')}
            disabled={submitting}
            onPress={onSubmit}
          />
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
