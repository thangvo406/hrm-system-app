import type { IAnswer, IQuestion } from '@hooks';

import { RadioButton } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import React, { useMemo } from 'react';
import { sortBy } from 'lodash';

const TEXT_DARK = '#1A1A1A';

type Properties = {
  readonly index: number;
  readonly onSelectOption: (questionId: number, answerId: number) => void;
  readonly question: IQuestion;
  readonly selectedAnswerId?: number;
};

function QuestionItem({
  index,
  onSelectOption,
  question,
  selectedAnswerId = undefined,
}: Properties) {
  const sortedAnswers = useMemo<IAnswer[]>(
    () => sortBy(question.answers || [], a => a.sortOrder ?? 0),
    [question.answers],
  );

  return (
    <View style={styles.container} testID={`question-${question.id}`}>
      <Text style={styles.title}>
        {`Q${index + 1}. ${question.title}`}
      </Text>
      <View style={styles.options}>
        {sortedAnswers.map(answer => (
          <RadioButton
            key={answer.id}
            label={answer.title}
            onPress={() => onSelectOption(question.id, answer.id)}
            selected={selectedAnswerId === answer.id}
            style={styles.option}
            testID={`question-${question.id}-answer-${answer.id}`}
          />
        ))}
      </View>
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
  title: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '600',
    lineHeight: ScaleSize(22),
  },
});
