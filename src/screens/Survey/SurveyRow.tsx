import type { Survey } from '@hooks';

import { Button } from '@components';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

const TEXT_DARK = '#1A1A1A';

type Properties = {
  readonly item: Survey;
  readonly onPressViewResult: (item: Survey) => void;
  readonly onPressStart: (item: Survey) => void;
};

function SurveyRow({ item, onPressViewResult, onPressStart }: Properties) {
  const { t } = useTranslation();
  const buttonCount =
    (item.allowToViewResponse ? 1 : 0) + (item.allowToStartSurvey ? 1 : 0);
  const buttonStyle = buttonCount > 1 ? styles.thirtyButton : undefined;

  const handleViewResult = () => {
    onPressViewResult(item);
  };

  const handleStart = () => {
    onPressStart(item);
  };

  return (
    <View style={styles.card} testID={`survey-${item.id}`}>
      <Text style={styles.title}>{item.name}</Text>

      <View style={styles.actionsRow}>
        {!!item?.allowToViewResponse && (
          <Button
            onPress={handleViewResult}
            title={t('survey.action_answer')}
            type="outline-bordered-rounded"
            style={buttonStyle}
          />
        )}

        {!!item?.allowToStartSurvey && (
          <Button
            onPress={handleStart}
            title={t('survey.action_start')}
            type="primary"
            style={buttonStyle}
          />
        )}
      </View>
    </View>
  );
}

export default React.memo(SurveyRow);

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: 'row',
    gap: ScaleSize(12),
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    gap: ScaleSize(20),
    paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(28),
  },
  thirtyButton: {
    width: '30%',
  },
  title: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '600',
    textAlign: 'center',
  },
});
