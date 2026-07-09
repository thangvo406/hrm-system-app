import { AppButton, Button } from '@components';
import Image from '@components/Image';
import RegisterHeader from '@screens/Authorisation/components/RegisterFlow/Header';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useRef } from 'react';
import { ScaleSize } from '@kits/core';
import type { IResponseUniversity } from '@type/auth';
import { useSchoolSelection } from '@hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppNavigator from '@navigation/AppNavigator';
import { DeviceUtils } from '@kits/core/utils';
const { ifIPadOrTablet } = DeviceUtils;
const BACK_ICON_SIZE = 24;
const ICON_CLEAR_SIZE = 16;
const ICON_SEARCH_SIZE = 22;
const PRIMARY_COLOR = '#5BB85C';
const ICON_COLOR = '#1A1A1A';
const BORDER_COLOR = '#D9D9D9';
const TEXT_COLOR = '#1A1A1A';
const SUBTITLE_COLOR = '#666666';
const PLACEHOLDER_COLOR = '#9E9E9E';

const handleDismissKeyboard = () => Keyboard.dismiss();

const UniversityItem = React.memo(function UniversityItem({
  item,
  isSelected,
  onPress,
}: {
  readonly item: IResponseUniversity;
  readonly isSelected: boolean;
  readonly onPress: (item: IResponseUniversity) => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(item)}
      style={[styles.schoolItem, isSelected && styles.schoolItemActive]}
      testID={`school-selection-item-${item.id}`}
    >
      <Text style={[styles.schoolName, isSelected && styles.schoolTextActive]}>
        {item.name}
      </Text>
      <Text
        style={[styles.schoolAddress, isSelected && styles.schoolTextActive]}
      >
        {item.address}
      </Text>
    </TouchableOpacity>
  );
});

function SchoolSelection() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const {
    handleClearKeyword,
    handleSelectSchool,
    handleSubmit,
    isStale,
    keyword,
    onLoadMore,
    selectedSchool,
    setKeyword,
    universities,
  } = useSchoolSelection();

  const handleFocusSearch = () => inputRef.current?.focus();

  const renderItem = ({ item }: { item: IResponseUniversity }) => (
    <UniversityItem
      isSelected={item.id === selectedSchool?.id}
      item={item}
      onPress={handleSelectSchool}
    />
  );

  return (
    <AppButton
      style={[styles.container, { paddingTop: insets.top }]}
      onPress={handleDismissKeyboard}
    >
      <RegisterHeader showBtnBack onBack={() => AppNavigator.goBack()} />

      <View style={styles.searchBlock}>
        <Text style={styles.title}>{t('school_selection.title')}</Text>
        <Text style={styles.searchLabel}>
          {t('school_selection.search_label')}
        </Text>
        <View style={styles.searchRow}>
          <AppButton
            activeOpacity={1}
            onPress={handleFocusSearch}
            style={styles.searchField}
          >
            <TextInput
              ref={inputRef}
              defaultValue=""
              onChangeText={setKeyword}
              value={keyword}
              placeholder={t('school_selection.search_placeholder')}
              placeholderTextColor={PLACEHOLDER_COLOR}
              style={styles.searchInput}
              testID="school-selection-search"
            />
            {keyword.length > 0 && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleClearKeyword}
                style={styles.clearButton}
                testID="school-selection-clear"
              >
                <Image
                  color={PLACEHOLDER_COLOR}
                  height={ICON_CLEAR_SIZE}
                  name="x-circle"
                  type="svg"
                  width={ICON_CLEAR_SIZE}
                />
              </TouchableOpacity>
            )}
          </AppButton>
          <AppButton
            activeOpacity={0.8}
            style={styles.searchButton}
            testID="school-selection-search-button"
          >
            {isStale ? (
              <ActivityIndicator color={ICON_COLOR} size="small" />
            ) : (
              <Image
                color={ICON_COLOR}
                height={ICON_SEARCH_SIZE}
                name="ic_search"
                type="svg"
                width={ICON_SEARCH_SIZE}
              />
            )}
          </AppButton>
        </View>
      </View>

      <FlatList
        ListEmptyComponent={
          keyword.length > 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {t('school_selection.empty')}
              </Text>
            </View>
          ) : undefined
        }
        data={universities}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="handled"
        maxToRenderPerBatch={10}
        onEndReached={onLoadMore}
        onEndReachedThreshold={1.5}
        removeClippedSubviews
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={styles.list}
        windowSize={5}
      />

      <View style={styles.footer}>
        <View style={styles.footerDivider} />
        <Button
          disabled={selectedSchool === undefined}
          onPress={handleSubmit}
          style={styles.submitButton}
          testID="school-selection-next"
          title={t('school_selection.next')}
          type="primary"
        />
      </View>
    </AppButton>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    height: BACK_ICON_SIZE,
    justifyContent: 'center',
    left: 16,
    position: 'absolute',
    top: 10,
    width: BACK_ICON_SIZE,
  },
  clearButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 48,
  },
  emptyText: {
    color: PLACEHOLDER_COLOR,
    fontSize: 14,
  },
  footer: {
    paddingBottom: 24,
    paddingTop: 12,
    width: ifIPadOrTablet('70%', '100%'),
    alignSelf: 'center',
  },
  footerDivider: {
    backgroundColor: '#F0F0F0',
    height: ScaleSize(10),
    marginBottom: ScaleSize(30),
    width: '100%',
  },
  list: {
    flex: 1,
    width: ifIPadOrTablet('70%', '100%'),
    alignSelf: 'center',
  },
  schoolAddress: {
    color: SUBTITLE_COLOR,
    fontSize: 14,
    marginTop: 8,
  },
  schoolItem: {
    borderBottomColor: '#F0F0F0',
    borderBottomWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  schoolItemActive: {
    backgroundColor: PRIMARY_COLOR,
    borderBottomColor: PRIMARY_COLOR,
  },
  schoolName: {
    color: TEXT_COLOR,
    fontSize: 16,
    fontWeight: '600',
  },
  schoolTextActive: {
    color: '#FFFFFF',
  },
  searchBlock: {
    paddingHorizontal: 24,
    paddingTop: 24,
    width: ifIPadOrTablet('70%', '100%'),
    alignSelf: 'center',
  },
  searchButton: {
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    width: 40,
  },
  searchField: {
    borderColor: BORDER_COLOR,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  searchInput: {
    color: TEXT_COLOR,
    fontSize: 15,
    paddingVertical: 12,
  },
  searchLabel: {
    color: TEXT_COLOR,
    fontSize: 15,
    marginBottom: 12,
  },
  searchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  submitButton: {
    alignSelf: 'center',
    width: '90%',
  },
  title: {
    color: TEXT_COLOR,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 32,
  },
});

export default React.memo(SchoolSelection);
