import type { IResponseSurveyDetail } from '@type/survey';
import type { Paths } from '@navigation/paths';
import type { RootScreenProps } from '@navigation/types';

import { AppConstants } from '@constants';
import {
  getSurveyDetailRequest,
  submitSurveyRequest,
} from '@services/slices/survey/surveySlice';
import { useAppDispatch } from '@services/common/storeHooks';
import { useEffect, useState } from 'react';
import AppNavigator from '@navigation/AppNavigator';

export type { IAnswer, IQuestion, IResponseSurveyDetail } from '@type/survey';

export type SurveySelection = {
  readonly answerText: string;
  readonly answerId: number;
  readonly questionId: number;
};

const { getParams, goBack, showSnackBar } = AppNavigator;

const isMissingId = (surveyId: number | string | undefined): boolean =>
  surveyId === undefined || surveyId === '';

export const useSurveyDetail = (props: RootScreenProps<Paths.SurveyDetail>) => {
  const { id: surveyId } = getParams(props) || {};
  const dispatch = useAppDispatch();
  const missingId = isMissingId(surveyId);

  const [data, setData] = useState<IResponseSurveyDetail | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState<boolean>(!missingId);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(
    missingId ? 'Missing survey id' : undefined,
  );
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [textAnswers, setTextAnswers] = useState<Record<number, string>>({});

  const handleSuccess = (detail: IResponseSurveyDetail) => {
    const seededAnswers: Record<number, number> = {};
    const seededTextAnswers: Record<number, string> = {};
    for (const question of detail.questions) {
      if (question.type === AppConstants.SURVEY_TYPE.SHORT_ANSWER) {
        if (question.selectedAnswerText !== undefined) {
          seededTextAnswers[question.id] = question.selectedAnswerText;
        }
        continue;
      }
      if (
        question.selectedAnswerId !== undefined &&
        question.selectedAnswerId > 0
      ) {
        seededAnswers[question.id] = question.selectedAnswerId;
      }
    }
    if (Object.keys(seededAnswers).length > 0) {
      setAnswers(seededAnswers);
    }
    if (Object.keys(seededTextAnswers).length > 0) {
      setTextAnswers(seededTextAnswers);
    }
    setData(detail);
    setLoading(false);
  };

  const handleFailure = (message: string) => {
    setError(message);
    setLoading(false);
  };

  useEffect(() => {
    if (isMissingId(surveyId)) {
      return;
    }
    dispatch(
      getSurveyDetailRequest({
        onFailure: handleFailure,
        onSuccess: handleSuccess,
        surveyId: surveyId as number | string,
      }),
    );
  }, [dispatch, surveyId]);

  const onSelectOption = (questionId: number, answerId: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const onChangeTextAnswer = (questionId: number, text: string) => {
    setTextAnswers(prev => ({ ...prev, [questionId]: text }));
  };

  const buildSelections = (): SurveySelection[] => {
    const result: SurveySelection[] = [];
    for (const question of data?.questions || []) {
      if (question.type === AppConstants.SURVEY_TYPE.SHORT_ANSWER) {
        const text = textAnswers[question.id];
        if (text === undefined || text?.trim?.() === '') {
          continue;
        }
        const _req: {
          -readonly [K in keyof SurveySelection]?: SurveySelection[K];
        } = {
          questionId: question?.id,
        };
        if (text) {
          _req.answerText = text;
        }
        result.push(_req as SurveySelection);
        continue;
      }
      const selectedAnswerId = answers[question?.id];
      if (selectedAnswerId === undefined) {
        continue;
      }
      const answer = question?.answers?.find(a => a.id === selectedAnswerId);
      if (!answer) {
        continue;
      }
      result.push({
        answerId: answer?.id,
        answerText: answer?.title,
        questionId: question.id,
      });
    }
    return result;
  };

  const onSubmitSuccess = () => {
    setSubmitting(false);
    showSnackBar({ message: '제출되었습니다.', type: 'success' });
    goBack();
  };

  const onSubmitFailure = (message: string) => {
    setSubmitting(false);
    showSnackBar({
      message: message || '제출에 실패했습니다.',
      type: 'failed',
    });
  };

  const onSubmit = () => {
    if (submitting || isMissingId(surveyId) || !data) {
      return;
    }
    setSubmitting(true);
    dispatch(
      submitSurveyRequest({
        answers: buildSelections(),
        onFailure: onSubmitFailure,
        onSuccess: onSubmitSuccess,
        surveyId: surveyId as number | string,
      }),
    );
  };

  return {
    answers,
    data,
    error,
    loading,
    onChangeTextAnswer,
    onSelectOption,
    onSubmit,
    selections: buildSelections(),
    submitting,
    textAnswers,
  };
};
