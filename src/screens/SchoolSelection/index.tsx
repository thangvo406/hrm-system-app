import { AppButton, Button } from '@components';
import Image from '@components/Image';
import RegisterHeader from '@screens/Authorisation/components/RegisterFlow/Header';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { ScaleSize } from '@kits/core';
import type { IResponseUniversity } from '@type/auth';
import { useSchoolSelection } from '@hooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppNavigator from '@navigation/AppNavigator';
import { DeviceUtils } from '@kits/core/utils';
const { ifIPadOrTablet } = DeviceUtils;
const LOGO_SIZE = 56;
const NUM_COLUMNS = 3;
const PRIMARY_COLOR = '#5BB85C';
const TEXT_COLOR = '#1A1A1A';
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
      style={[styles.schoolCard, isSelected && styles.schoolCardActive]}
      testID={`school-selection-item-${item.id}`}
    >
      <View style={styles.logoWrapper}>
        {item.logoUrl ? (
          <Image
            resizeMode="contain"
            style={styles.logoImage}
            url={item.logoUrl}
          />
        ) : (
          <View style={styles.logoFallback}>
            <Text style={styles.logoFallbackText}>{item.name.charAt(0)}</Text>
          </View>
        )}
      </View>
      <Text numberOfLines={2} style={styles.schoolName}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
});

function SchoolSelection(props: any) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    handleSelectSchool,
    handleSubmit,
    keyword,
    onLoadMore,
    selectedSchool,
    universities,
  } = useSchoolSelection(props);

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
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        data={universities}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="handled"
        maxToRenderPerBatch={12}
        numColumns={NUM_COLUMNS}
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
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  columnWrapper: {
    gap: 12,
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
  listContent: {
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  logoFallback: {
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: LOGO_SIZE / 2,
    height: LOGO_SIZE,
    justifyContent: 'center',
    width: LOGO_SIZE,
  },
  logoFallbackText: {
    color: TEXT_COLOR,
    fontSize: 20,
    fontWeight: '700',
  },
  logoImage: {
    borderRadius: LOGO_SIZE / 2,
    height: LOGO_SIZE,
    width: LOGO_SIZE,
  },
  logoWrapper: {
    alignItems: 'center',
    height: LOGO_SIZE,
    justifyContent: 'center',
    marginBottom: 10,
    width: LOGO_SIZE,
  },
  schoolCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    elevation: 3,
    flex: 1,
    marginTop: 12,
    paddingHorizontal: 8,
    paddingVertical: 16,
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  schoolCardActive: {
    borderColor: PRIMARY_COLOR,
    borderWidth: 2,
  },
  schoolName: {
    color: TEXT_COLOR,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  searchBlock: {
    paddingHorizontal: 24,
    paddingTop: 24,
    width: ifIPadOrTablet('70%', '100%'),
    alignSelf: 'center',
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
