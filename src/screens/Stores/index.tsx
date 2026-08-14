import type { ListRenderItem } from 'react-native';
import type { IStoreItem } from '@type/store';

import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ScaleSize } from '@kits/core';
import { Colors } from '@constants';
import { EmptyView, StoresLoading } from '@components';
import { useStore } from '@hooks';
import { useTranslation } from 'react-i18next';

import SearchBar from './SearchBar';
import StoreCard from './StoreCard';
import HeaderDetail from '@components/HeaderDetail';
import imageNames from '@assets/images/names';

const LIST_FADE_IN_DURATION_MS = 300;

const keyExtractor = (item: IStoreItem) => String(item.id);

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
    onRefresh,
    onSearchChange,
    refreshing,
    stores,
    storeOrderRecent,
    onBack,
  } = useStore();

  const renderItem: ListRenderItem<IStoreItem> = ({ item }) => {
    return (
      <StoreCard
        onPressProduct={onPressProduct}
        onPressStore={onPressStore}
        store={item}
      />
    );
  };

  const isShowList =
    storeOrderRecent?.products?.length > 0 || stores?.length > 0;

  return (
    <View style={styles.safeArea}>
      <HeaderDetail title={t('stores.title')} onPressBack={onBack} />

      <SearchComponent
        onPressFilter={onPressFilter}
        setKeyword={onSearchChange}
      />
      {loading ? (
        <StoresLoading />
      ) : isShowList ? (
        <Animated.View
          entering={FadeIn.duration(LIST_FADE_IN_DURATION_MS)}
          style={styles.listWrapper}
        >
          <FlatList
            ItemSeparatorComponent={ItemSeparator}
            contentContainerStyle={styles.listContent}
            data={stores}
            ListHeaderComponent={
              storeOrderRecent ? (
                <StoreCard
                  onPressProduct={onPressProduct}
                  onPressStore={onPressStore}
                  store={storeOrderRecent}
                />
              ) : undefined
            }
            keyExtractor={keyExtractor}
            refreshControl={
              <RefreshControl
                colors={[Colors.primary]}
                onRefresh={onRefresh}
                refreshing={refreshing}
                tintColor={Colors.primary}
              />
            }
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
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
  listWrapper: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  sectionLabel: {
    color: '#5C5C5C',
    fontSize: ScaleSize(14),
    marginTop: ScaleSize(30),
  },
  separator: {
    height: ScaleSize(8),
  },
});
