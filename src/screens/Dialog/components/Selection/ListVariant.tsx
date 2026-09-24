import type { LayoutChangeEvent } from 'react-native';
import type { TSelectionItem, TSelectionProps } from '@type/dialog';

import EmptyList from './EmptyList';
import get from 'lodash/get';
import OptionRow from './OptionRow';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import SelectionShell, { CONFIRM_RESERVED_HEIGHT } from './SelectionShell';
import TextField from '@components/TextField';
import { DeviceUtils } from '@kits/core/utils';
import { Keyboard, StyleSheet } from 'react-native';
import { ScaleSize } from '@kits/core';
import { ScrollView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';

const { ifIOS } = DeviceUtils;
const EMPTY_LIST_LENGTH = 0;

type SelectionSize = {
  readonly height: number;
  readonly width: number;
};

type Properties = Extract<TSelectionProps, { type?: 'list' }>;

/** Nhánh danh sách: ô tìm kiếm, các dòng chọn, và dấu check ở dòng đang chọn. */
function ListVariant({
  emptyType,
  items,
  itemSelected = undefined,
  onRequestClose,
  onSelect,
  pathDisplay = 'label',
  pathSelected = '',
  searchKeyboardType = 'default',
  showSearchBar = true,
  title,
}: Properties) {
  const [selected, setSelected] = useState(itemSelected);
  const [keySearch, setKeySearch] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [size, setSize] = useState<SelectionSize | undefined>(undefined);
  const { t } = useTranslation();

  const scrollReference = useRef<ScrollView>(null);
  /** Toạ độ dòng đang chọn, do chính dòng đó đo và báo lên. */
  const selectedOffsetRef = useRef<number | undefined>(undefined);
  const hasContentSizeRef = useRef(false);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    const listenerShow = ifIOS('keyboardWillShow', 'keyboardDidShow');
    const listenerHide = ifIOS('keyboardWillHide', 'keyboardDidHide');
    const keyboardDidShow = Keyboard.addListener(listenerShow, event => {
      setKeyboardHeight(event.endCoordinates.height);
    });

    const keyboardDidHide = Keyboard.addListener(listenerHide, () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShow?.remove();
      keyboardDidHide?.remove();
    };
  }, []);

  const displayData = keySearch.trim()
    ? items.filter(item =>
        get(item, pathDisplay)?.toLowerCase().includes(keySearch.toLowerCase()),
      )
    : items;

  /**
   * Mở sheet là thấy ngay dòng đang chọn, không phải tự cuộn đi tìm.
   *
   * Cần HAI điều kiện: biết toạ độ dòng đang chọn (`onLayout` của dòng đó) và
   * `ScrollView` đã biết kích thước nội dung (cuộn sớm hơn thì bị kẹp về 0).
   * Thứ tự hai sự kiện đó không được RN bảo đảm, nên cả hai đều gọi hàm này và
   * lần nào đủ điều kiện thì lần đó cuộn — `hasScrolledRef` lo việc chỉ cuộn
   * một lần. Đang gõ tìm thì bỏ qua: danh sách đã ngắn lại rồi.
   */
  const scrollToSelected = useCallback(() => {
    const offset = selectedOffsetRef.current;
    if (
      hasScrolledRef.current ||
      !hasContentSizeRef.current ||
      offset === undefined ||
      keySearch
    ) {
      return;
    }
    hasScrolledRef.current = true;
    scrollReference.current?.scrollTo({ animated: false, y: offset });
  }, [keySearch]);

  const onContentSizeChange = useCallback(() => {
    hasContentSizeRef.current = true;
    scrollToSelected();
  }, [scrollToSelected]);

  const onMeasureSelected = useCallback(
    (y: number) => {
      selectedOffsetRef.current = y;
      scrollToSelected();
    },
    [scrollToSelected],
  );

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (size || displayData.length === EMPTY_LIST_LENGTH) {
        return;
      }
      setSize({
        height: event.nativeEvent.layout.height,
        width: event.nativeEvent.layout.width,
      });
    },
    [displayData.length, size],
  );

  const onConfirm = useCallback(() => {
    onSelect(selected);
    onRequestClose?.();
  }, [onRequestClose, onSelect, selected]);

  const onPickKeySearch = useCallback(() => {
    onSelect(keySearch);
    onRequestClose?.();
  }, [keySearch, onRequestClose, onSelect]);

  return (
    <SelectionShell
      keyboardHeight={keyboardHeight}
      onConfirm={onConfirm}
      onLayout={onLayout}
      size={size}
      title={title}
    >
      {showSearchBar ? (
        <TextField
          iconName="ic_search"
          keyboardType={searchKeyboardType}
          onChangeText={setKeySearch}
          placeholder={t('common.search')}
        />
      ) : undefined}

      <ScrollView
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={onContentSizeChange}
        ref={scrollReference}
        style={styles.list}
      >
        {displayData.length === EMPTY_LIST_LENGTH &&
        emptyType === 'selection' ? (
          <EmptyList keySearch={keySearch} onPick={onPickKeySearch} />
        ) : undefined}

        {displayData.map((item, index) => {
          const value = get(item, pathSelected);
          const isSelected =
            typeof selected === 'string'
              ? selected === value
              : get(selected, pathSelected) === value;

          return (
            <OptionRow
              isLast={index === displayData.length - 1}
              isSelected={isSelected}
              item={item as TSelectionItem}
              key={item.id}
              label={get(item, pathDisplay)}
              onMeasure={onMeasureSelected}
              onPress={() => {
                setSelected(item);
              }}
            />
          );
        })}
      </ScrollView>
    </SelectionShell>
  );
}

export default React.memo(ListVariant);

const styles = StyleSheet.create({
  list: {
    flexGrow: 0,
    flexShrink: 1,
    marginBottom: CONFIRM_RESERVED_HEIGHT,
  },
  listContent: {
    gap: ScaleSize(8),
    paddingBottom: ScaleSize(8),
  },
});
