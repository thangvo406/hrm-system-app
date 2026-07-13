import { useDeferredValue, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '@services/common/storeHooks';
import {
  getUniversitiesRequest,
  selectSchoolRequest,
} from '@services/slices/auth/authSlice';
import type { IResponseUniversity } from '@type/auth';
import type { ListApiResponse } from '@type/common';
import AppNavigator from '@navigation/AppNavigator';
import { AppStacks } from '@navigation/paths';

const PAGE_SIZE = 20;

export const useSchoolSelection = ({ onSubmit }: any) => {
  const dispatch = useAppDispatch();
  const [universities, setUniversities] = useState<IResponseUniversity[]>([]);
  const [keyword, setKeyword] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<
    IResponseUniversity | undefined
  >();

  const deferredKeyword = useDeferredValue(keyword);
  const currentPage = useRef(0);
  const isLast = useRef(false);
  const isLoadingMore = useRef(false);

  const fetchUniversities = (reset: boolean) => {
    const page = reset ? 0 : currentPage.current;
    dispatch(
      getUniversitiesRequest({
        keyword: deferredKeyword || undefined,
        page,
        size: PAGE_SIZE,
        onSuccess: (data: ListApiResponse<IResponseUniversity[]>) => {
          isLast.current = data.last;
          isLoadingMore.current = false;
          setUniversities(prev =>
            reset ? data.content : [...prev, ...data.content],
          );
        },
        onFailure: () => {
          isLoadingMore.current = false;
        },
      }),
    );
  };

  useEffect(() => {
    currentPage.current = 0;
    isLast.current = false;
    fetchUniversities(true);
  }, [deferredKeyword]);

  const onLoadMore = () => {
    if (isLast.current || isLoadingMore.current) return;
    isLoadingMore.current = true;
    currentPage.current += 1;
    fetchUniversities(false);
  };

  const handleSelectSchool = (school: IResponseUniversity) => {
    setSelectedSchool(school);
  };

  const handleClearKeyword = () => setKeyword('');

  const handleSubmit = () => {
    if (!selectedSchool) return;
    if (onSubmit) {
      onSubmit(selectedSchool);
      return;
    }
    dispatch(
      selectSchoolRequest({
        onFailure: (error: any) => {
          AppNavigator.showSnackBar({
            message: error.message,
            type: 'failed',
          });
        },
        onSuccess: () => {
          AppNavigator.replace(AppStacks.App);
        },
        universityId: selectedSchool.id,
      }),
    );
  };

  return {
    handleClearKeyword,
    handleSelectSchool,
    handleSubmit,
    isStale: keyword !== deferredKeyword,
    keyword,
    onLoadMore,
    selectedSchool,
    setKeyword,
    universities,
  };
};
