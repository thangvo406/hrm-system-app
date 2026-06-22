import type { ListRenderItem } from 'react-native';
import type { StoreItem } from '@hooks';

import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ScaleSize } from '@kits/core';
import { EmptyView, StoresLoading } from '@components';
import { useStore } from '@hooks';
import { useTranslation } from 'react-i18next';

import SearchBar from './SearchBar';
import StoreCard from './StoreCard';
import HeaderDetail from '@components/HeaderDetail';
import imageNames from '@assets/images/names';

const keyExtractor = (item: StoreItem) => String(item.id);

function ItemSeparator() {
  return <View style={styles.separator} />;
}

type SearchComponentProps = {
  readonly setKeyword: (value: string) => void;
  readonly onPressFilter: () => void;
};

function SearchComponent({ onPressFilter, setKeyword }: SearchComponentProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.listHeader}>
      <SearchBar
        onChangeText={setKeyword}
        onPressFilter={onPressFilter}
        placeholder={t('stores.search_placeholder')}
      />
      <Text style={styles.sectionLabel}>{t('stores.section_label')}</Text>
    </View>
  );
}

function Stores() {
  const { t } = useTranslation();
  const {
    loading,
    onPressFilter,
    onPressProduct,
    onPressStore,
    onSearchChange,
    stores,
  } = useStore();

  const renderItem: ListRenderItem<StoreItem> = ({ item }) => (
    <StoreCard
      onPressProduct={onPressProduct}
      onPressStore={onPressStore}
      store={item}
    />
  );

  return (
    <View style={styles.safeArea}>
      <HeaderDetail title={t('stores.title')} />
      {loading ? (
        <StoresLoading />
      ) : stores?.length > 0 ? (
        <>
          <SearchComponent
            onPressFilter={onPressFilter}
            setKeyword={onSearchChange}
          />
          <FlatList
            ItemSeparatorComponent={ItemSeparator}
            contentContainerStyle={styles.listContent}
            data={stores}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <EmptyView icon={imageNames.ic_store} desc={t('common.no_data')} />
      )}
    </View>
  );
}

export default Stores;

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: ScaleSize(32),
  },
  listHeader: {
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(12),
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  sectionLabel: {
    color: '#5C5C5C',
    fontSize: ScaleSize(14),
    marginVertical: ScaleSize(30),
  },
  separator: {
    height: ScaleSize(8),
  },
});
