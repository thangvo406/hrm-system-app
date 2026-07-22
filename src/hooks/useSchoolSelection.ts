import { useDeferredValue, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import {
  getUniversitiesRequest,
  selectSchoolRequest,
} from '@services/slices/auth/authSlice';
import type { IResponseUniversity } from '@type/auth';
import type { ListApiResponse } from '@type/common';
import AppNavigator from '@navigation/AppNavigator';
import { AppStacks } from '@navigation/paths';
import { AuthSelector } from '@services/selectors/auth';

const PAGE_SIZE = 20;

export const useSchoolSelection = ({ onSubmit }: any) => {
  const dispatch = useAppDispatch();

  // The default (no-keyword) list is owned by the store cache — the hook
  // renders it straight from the selectors, so there is a single source of
  // truth and no store→local copying inside an effect.
  const {
    content: cachedUniversities,
    isLast: cachedIsLast,
    page: cachedPage,
  } = useAppSelector(AuthSelector.getUniversityData);

  // Search results are transient and never cached (the saga only caches the
  // no-keyword list), so they stay in local state.
  const [searchResults, setSearchResults] = useState<IResponseUniversity[]>([]);
  const [keyword, setKeyword] = useState('');
  // Only covers the first default load (empty cache). Lazy init keeps a warm
  // cache from needing a setState inside the effect.
  const [loading, setLoading] = useState(
    () => cachedUniversities?.length === 0,
  );
  const [selectedSchool, setSelectedSchool] = useState<
    IResponseUniversity | undefined
  >();

  const deferredKeyword = useDeferredValue(keyword);
  const isSearching = Boolean(deferredKeyword);

  // Search pagination cursor lives in refs; the default list's cursor lives in
  // the store (cachedPage / cachedIsLast).
  const searchPage = useRef(0);
  const searchIsLast = useRef(false);
  const isLoadingMore = useRef(false);

  // Displayed list: search results while searching, otherwise the cached list.
  const universities = isSearching ? searchResults : cachedUniversities;

  const fetchDefault = (page: number) => {
    dispatch(
      getUniversitiesRequest({
        page,
        size: PAGE_SIZE,
        // No keyword → the saga caches the response into the store; the hook
        // renders it via the selector, so there is nothing to set here beyond
        // the load guards.
        onSuccess: () => {
          isLoadingMore.current = false;
          setLoading(false);
        },
        onFailure: () => {
          isLoadingMore.current = false;
          setLoading(false);
        },
      }),
    );
  };

  const fetchSearch = (page: number) => {
    dispatch(
      getUniversitiesRequest({
        keyword: deferredKeyword,
        page,
        size: PAGE_SIZE,
        onSuccess: (data: ListApiResponse<IResponseUniversity[]>) => {
          searchIsLast.current = data.last;
          isLoadingMore.current = false;
          setSearchResults(prev =>
            page === 0 ? data.content : [...prev, ...data.content],
          );
        },
        onFailure: () => {
          isLoadingMore.current = false;
        },
      }),
    );
  };

  useEffect(() => {
    isLoadingMore.current = false;

    // Searching: always fetch page 0 for the keyword. The "pending" feedback
    // comes from `isStale` (useDeferredValue), so no loading toggle is needed.
    if (isSearching) {
      searchPage.current = 0;
      searchIsLast.current = false;
      fetchSearch(0);
      return;
    }

    // Default list: fetch only when the store cache is empty; otherwise it is
    // already rendered from the store.
    if (cachedUniversities?.length === 0) {
      fetchDefault(0);
    }
    // Only react to keyword changes; store updates from our own fetch must not
    // retrigger this effect.
  }, [deferredKeyword]);

  const onLoadMore = () => {
    if (isLoadingMore.current) return;

    if (isSearching) {
      if (searchIsLast.current) return;
      isLoadingMore.current = true;
      searchPage.current += 1;
      fetchSearch(searchPage.current);
      return;
    }

    if (cachedIsLast) return;
    isLoadingMore.current = true;
    fetchDefault(cachedPage + 1);
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
    loading,
    selectedSchool,
    setKeyword,
    universities,
  };
};
