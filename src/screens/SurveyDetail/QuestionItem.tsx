import type { IAnswer, IQuestion } from '@hooks';
import { RadioButton } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useMemo } from 'react';
import { sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';

const PLACEHOLDER_COLOR = '#9E9E9E';
const TEXT_DARK = '#1A1A1A';
const UNDERLINE_COLOR = '#E0E0E0';

type Properties = {
  readonly disabled?: boolean;
  readonly isShortAnswer?: boolean;
  readonly index: number;
  readonly onChangeTextAnswer?: (questionId: number, text: string) => void;
  readonly onSelectOption: (questionId: number, answerId: number) => void;
  readonly question: IQuestion;
  readonly selectedAnswerId?: number;
  readonly textAnswer?: string;
};

function QuestionItem({
  disabled = false,
  index,
  onChangeTextAnswer = undefined,
  onSelectOption,
  question,
  isShortAnswer = false,
  selectedAnswerId = undefined,
  textAnswer = undefined,
}: Properties) {
  const { t } = useTranslation();
  const sortedAnswers = useMemo<IAnswer[]>(
    () => sortBy(question.answers || [], a => a.sortOrder ?? 0),
    [question.answers],
  );

  return (
    <View style={styles.container} testID={`question-${question.id}`}>
      <Text style={styles.title}>{`Q${index + 1}. ${question.title}`}</Text>
      {isShortAnswer ? (
        <TextInput
          editable={!disabled}
          onChangeText={text => onChangeTextAnswer?.(question.id, text)}
          placeholder={t('survey_detail.short_answer_placeholder')}
          placeholderTextColor={PLACEHOLDER_COLOR}
          style={styles.shortAnswerInput}
          testID={`question-${question.id}-text`}
          underlineColorAndroid="transparent"
          value={textAnswer}
        />
      ) : (
        <View style={styles.options}>
          {sortedAnswers.map(answer => (
            <RadioButton
              key={answer.id}
              disabled={disabled}
              label={answer.title}
              onPress={() => onSelectOption(question.id, answer.id)}
              selected={selectedAnswerId === answer.id}
              style={styles.option}
              testID={`question-${question.id}-answer-${answer.id}`}
            />
          ))}
        </View>
      )}
    </View>
  );
}

export default React.memo(QuestionItem);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    gap: ScaleSize(14),
    paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(20),
  },
  option: {
    paddingVertical: ScaleSize(2),
  },
  options: {
    gap: ScaleSize(12),
    paddingLeft: ScaleSize(12),
  },
  shortAnswerInput: {
    borderBottomColor: UNDERLINE_COLOR,
    borderBottomWidth: ScaleSize(1),
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    paddingHorizontal: ScaleSize(12),
    paddingVertical: ScaleSize(10),
  },
  title: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '600',
    lineHeight: ScaleSize(22),
  },
});
