import type { Survey } from '@hooks';

import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

const ACTIVE_DARK = '#1A1A1A';
const BUTTON_DISABLED_BG = '#9E9E9E';
const BUTTON_GHOST_BG = '#C9C9C9';
const TEXT_DARK = '#1A1A1A';

type Properties = {
  readonly item: Survey;
  readonly onPressViewResult: (item: Survey) => void;
  readonly onPressStart: (item: Survey) => void;
};

function SurveyRow({ item, onPressViewResult, onPressStart }: Properties) {
  const { t } = useTranslation();
  const isOnlyViewResult = item.allowToViewResponse && !item.allowToStartSurvey;

  const handleViewResult = () => {
    onPressViewResult(item);
  };

  const handleStart = () => {
    onPressStart(item);
  };

  return (
    <View style={styles.card} testID={`survey-${item.id}`}>
      <Text style={styles.title}>{item.name}</Text>

      {isOnlyViewResult ? (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleViewResult}
          style={[styles.button, styles.buttonClosed]}
          testID={`survey-${item.id}-answer`}
        >
          <Text style={styles.buttonClosedLabel}>
            {t('survey.action_answer')}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleViewResult}
            style={[styles.button, styles.buttonGhost]}
            testID={`survey-${item.id}-answer`}
          >
            <Text style={styles.buttonGhostLabel}>
              {t('survey.action_answer')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleStart}
            style={[styles.button, styles.buttonPrimary]}
            testID={`survey-${item.id}-start`}
          >
            <Text style={styles.buttonPrimaryLabel}>
              {t('survey.action_start')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
  button: {
    alignItems: 'center',
    height: ScaleSize(44),
    justifyContent: 'center',
    borderRadius: ScaleSize(22),
    width: '35%',
  },
  buttonClosed: {
    backgroundColor: BUTTON_DISABLED_BG,
    borderRadius: ScaleSize(22),
    width: '80%',
    alignSelf: 'center',
  },
  buttonClosedLabel: {
    color: '#FFFFFF',
    fontSize: ScaleSize(14),
    fontWeight: '500',
  },
  buttonGhost: {
    backgroundColor: BUTTON_GHOST_BG,
  },
  buttonGhostLabel: {
    color: '#FFFFFF',
    fontSize: ScaleSize(14),
    fontWeight: '500',
  },
  buttonHalf: {
    flex: 1,
  },
  buttonPrimary: {
    backgroundColor: ACTIVE_DARK,
  },
  buttonPrimaryLabel: {
    color: '#FFFFFF',
    fontSize: ScaleSize(14),
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    gap: ScaleSize(20),
    paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(28),
  },
  title: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '600',
    textAlign: 'center',
  },
});
