import type { School } from '@hooks/useRegister';

import { Button } from '@components';
import Image from '@components/Image';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { ScaleSize } from '@kits/core';

const BANNER_HEIGHT = 30;
const BANNER_WIDTH = 68;
const ICON_CLEAR_SIZE = 16;
const ICON_SEARCH_SIZE = 22;
const PRIMARY_COLOR = '#5BB85C';
const ICON_COLOR = '#1A1A1A';
const BORDER_COLOR = '#D9D9D9';
const TEXT_COLOR = '#1A1A1A';
const SUBTITLE_COLOR = '#666666';
const PLACEHOLDER_COLOR = '#9E9E9E';

type ChooseSchoolValues = {
  readonly school: School;
};

type ChooseSchoolProps = {
  readonly disabled?: boolean;
  readonly filteredSchools: readonly School[];
  readonly onSchoolKeywordChange: (value: string) => void;
  readonly onSelectSchool: (school: School) => void;
  readonly onSubmit: (values: ChooseSchoolValues) => void;
  readonly schoolKeyword: string;
  readonly selectedSchool?: School;
  readonly selectedSchoolId?: string;
};

function ChooseSchool({
  disabled = false,
  filteredSchools,
  onSchoolKeywordChange,
  onSelectSchool,
  onSubmit,
  schoolKeyword,
  selectedSchool = undefined,
  selectedSchoolId = undefined,
}: ChooseSchoolProps) {
  const { t } = useTranslation();

  const handleSubmit = () => {
    if (selectedSchool) onSubmit({ school: selectedSchool });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          height={BANNER_HEIGHT}
          name="ic_logo_banner"
          width={BANNER_WIDTH}
        />
      </View>

      <View style={styles.searchBlock}>
        <Text style={styles.title}>{t('choose_school.title')}</Text>

        <Text style={styles.searchLabel}>
          {t('choose_school.search_label')}
        </Text>

        <View style={styles.searchRow}>
          <View style={styles.searchField}>
            <TextInput
              onChangeText={onSchoolKeywordChange}
              placeholder={t('choose_school.search_placeholder')}
              placeholderTextColor={PLACEHOLDER_COLOR}
              style={styles.searchInput}
              testID="choose-school-search"
              value={schoolKeyword}
            />
            {schoolKeyword.length > 0 && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  onSchoolKeywordChange('');
                }}
                style={styles.clearButton}
                testID="choose-school-clear"
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
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.searchButton}
            testID="choose-school-search-button"
          >
            <Image
              color={ICON_COLOR}
              height={ICON_SEARCH_SIZE}
              name="ic_search"
              type="svg"
              width={ICON_SEARCH_SIZE}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ListEmptyComponent={
          schoolKeyword.length > 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t('choose_school.empty')}</Text>
            </View>
          ) : undefined
        }
        data={filteredSchools}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const isSelected = item.id === selectedSchoolId;
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                onSelectSchool(item);
              }}
              style={[styles.schoolItem, isSelected && styles.schoolItemActive]}
              testID={`choose-school-item-${item.id}`}
            >
              <Text
                style={[
                  styles.schoolName,
                  isSelected && styles.schoolTextActive,
                ]}
              >
                {item.name}
              </Text>
              <Text
                style={[
                  styles.schoolAddress,
                  isSelected && styles.schoolTextActive,
                ]}
              >
                {item.address}
              </Text>
            </TouchableOpacity>
          );
        }}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />

      <View style={styles.footer}>
        <View
          style={{
            width: '100%',
            height: ScaleSize(10),
            backgroundColor: '#F0F0F0',
            marginBottom: ScaleSize(30),
            // position: 'absolute',
            // bottom: ScaleSize(20),
          }}
        />
        <Button
          disabled={disabled || selectedSchool === undefined}
          onPress={handleSubmit}
          style={{
            width: '90%',
            alignSelf: 'center',
          }}
          testID="choose-school-next"
          title={t('choose_school.next')}
          type="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingBottom: ScaleSize(10),
    paddingTop: 16,
  },
  list: {
    flex: 1,
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
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  title: {
    color: TEXT_COLOR,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 32,
  },
});

export default React.memo(ChooseSchool);
export type { School } from '@hooks/useRegister';
export type { ChooseSchoolValues };
