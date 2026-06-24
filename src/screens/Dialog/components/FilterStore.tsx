import Button from '@components/Button';
import RadioButton from '@components/RadioButton';
import { ScaleSize } from '@kits/core';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

type SortBy = 'name' | 'openingHours' | 'sortOrder';
type SortDirection = 'asc' | 'desc';

export type StoreFilterValue = {
  readonly sortBy: SortBy;
  readonly sortDirection: SortDirection;
};

type FilterStoreProps = {
  readonly initialValue?: StoreFilterValue;
  readonly onRequestClose?: () => void;
  readonly onSubmit?: (value: StoreFilterValue) => void;
};

const DEFAULT_FILTER: StoreFilterValue = {
  sortBy: 'sortOrder',
  sortDirection: 'asc',
};

const NOOP = (): void => undefined;

function FilterStore({
  initialValue = DEFAULT_FILTER,
  onRequestClose = NOOP,
  onSubmit = NOOP,
}: FilterStoreProps) {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<SortBy>(initialValue.sortBy);
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    initialValue.sortDirection,
  );

  const { SORT_DIRECTION, SORT_BY } = useMemo(() => {
    const SORT_BY = [
      {
        text: t('stores.filter.sort_by_order'),
        value: 'sortOrder' as SortBy,
      },
      {
        text: t('stores.filter.sort_by_name'),
        value: 'name' as SortBy,
      },
      {
        text: t('stores.filter.sort_by_opening'),
        value: 'openingHours' as SortBy,
      },
    ];

    const SORT_DIRECTION = [
      {
        text: t('stores.filter.direction_asc'),
        value: 'asc' as SortDirection,
      },
      {
        text: t('stores.filter.direction_desc'),
        value: 'desc' as SortDirection,
      },
    ];
    return {
      SORT_BY,
      SORT_DIRECTION,
    };
  }, []);

  const handleSubmit = () => {
    onSubmit({ sortBy, sortDirection });
    onRequestClose();
  };

  return (
    <View style={styles.container} testID="filter-store">
      <Text style={styles.title}>{t('stores.filter.title')}</Text>

      <Text style={styles.sectionTitle}>{t('stores.filter.sort_by')}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {SORT_BY.map(it => (
          <RadioButton
            key={it.value}
            label={it.text}
            onPress={() => setSortBy(it.value)}
            selected={sortBy === it.value}
            style={{ marginBottom: ScaleSize(8), width: '50%' }}
            testID={`filter-sort-${it.value}`}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>
        {t('stores.filter.sort_direction')}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginBottom: ScaleSize(20),
        }}
      >
        {SORT_DIRECTION.map(it => (
          <RadioButton
            key={it.value}
            label={it.text}
            onPress={() => setSortDirection(it.value)}
            selected={sortDirection === it.value}
            style={{ marginBottom: ScaleSize(8), width: '50%' }}
            testID={`filter-direction-${it.value}`}
          />
        ))}
      </View>

      <Button
        onPress={handleSubmit}
        testID="filter-submit"
        title={t('stores.filter.submit')}
        type="rounded"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: ScaleSize(20),
  },
  sectionTitle: {
    fontSize: ScaleSize(18),
    fontWeight: '500',
    marginBottom: ScaleSize(8),
    marginTop: ScaleSize(10),
  },
  title: {
    fontSize: ScaleSize(24),
    fontWeight: 'bold',
  },
});

export default FilterStore;
