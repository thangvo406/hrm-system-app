import type { GetSurveyListPayload, Survey } from '@type/survey';

import { ListApiResponse } from '@type/common';
import { Paths } from '@navigation/paths';
import { getSurveyListRequest } from '@services/slices/survey/surveySlice';
import { useAppDispatch } from '@services/common/storeHooks';
import { useCallback, useRef, useState } from 'react';
import AppNavigator from '@navigation/AppNavigator';
import { useFocusEffect } from '@react-navigation/native';

export type { Survey, SurveyStatus } from '@type/survey';

const PAGE_SIZE = 10;

export const useSurvey = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<Survey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(0);
  const isLast = useRef(false);
  const isLoadingMore = useRef(false);

  const handleSuccess = (response: ListApiResponse<Survey[]>) => {
    isLast.current = response.last;
    setLoading(false);
    setData(prev =>
      currentPage === 0
        ? response?.content || []
        : [...(prev || []), ...(response?.content || [])],
    );
    isLoadingMore.current = false;
  };

  const handleFailure = (message: string) => {
    setError(message);
    setLoading(false);
    isLoadingMore.current = false;
  };

  useFocusEffect(
    useCallback(() => {
      isLoadingMore.current = true;
      const payload: GetSurveyListPayload = {
        onFailure: handleFailure,
        onSuccess: handleSuccess,
        page: currentPage,
        size: PAGE_SIZE,
      };
      dispatch(getSurveyListRequest(payload));
    }, [currentPage, dispatch]),
  );

  const onLoadMore = useCallback(() => {
    if (isLast.current || isLoadingMore.current) {
      return;
    }
    isLoadingMore.current = true;
    setCurrentPage(prev => prev + 1);
  }, []);

  const onPressViewResult = useCallback((item: Survey) => {
    AppNavigator.navigate(Paths.SurveyDetail, {
      id: item.id,
      isViewResult: true,
    });
  }, []);

  const onPressStart = useCallback((item: Survey) => {
    AppNavigator.navigate(Paths.SurveyDetail, { id: item.id });
  }, []);

  return {
    data,
    error,
    loading,
    onLoadMore,
    onPressViewResult,
    onPressStart,
  };
};
