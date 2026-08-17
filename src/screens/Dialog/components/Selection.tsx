import { Keyboard, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { ScaleSize } from '@kits/core';
import Image from '@components/Image';
import get from 'lodash/get';
import { ScrollView } from 'react-native-gesture-handler';
import TextField from '@components/TextField';
import Button from '@components/Button';
import { Trans, useTranslation } from 'react-i18next';
import AppButton from '@components/AppButton';
import { DeviceUtils } from '@kits/core/utils';
import { Colors } from '@constants';

const CHECK_ICON_SIZE = ScaleSize(22);
const CHECK_COLOR = '#5BB85C';
const TEXT_COLOR = '#1A1A1A';
const { ifIOS } = DeviceUtils;
const NOOP = (): void => undefined;

export type SelectionItem = {
  readonly id: string;
  readonly label: string;
};

type SelectionLayout = {
  readonly height: number;
  readonly width: number;
};

type SelectionProps = {
  readonly items: readonly SelectionItem[];
  readonly itemSelected?: Record<string, unknown> | string;
  readonly onRequestClose?: () => void;
  readonly onSelect: (item: any) => void;
  readonly pathDisplay?: string;
  readonly pathSelected?: string;
  readonly emptyType?: string;
  readonly showSearchBar?: boolean;
  readonly title?: string;
};

function Selection({
  items,
  itemSelected = undefined,
  onRequestClose = NOOP,
  onSelect,
  pathDisplay = 'label',
  pathSelected = '',
  showSearchBar = true,
  emptyType,
  title = undefined,
}: SelectionProps) {
  const [selected, setSelected] = useState(itemSelected);
  const [keySearch, setKeySearch] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [layout, setLayout] = useState<SelectionLayout | undefined>(undefined);
  const { t } = useTranslation();

  useEffect(() => {
    const listenerShow = ifIOS('keyboardWillShow', 'keyboardDidShow');
    const listenerHide = ifIOS('keyboardWillHide', 'keyboardDidHide');
    const keyboardDidShow = Keyboard.addListener(listenerShow, e => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const keyboardDidHide = Keyboard.addListener(listenerHide, () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShow?.remove();
      keyboardDidHide?.remove();
    };
  }, []);

  const displayData = useMemo(() => {
    if (!keySearch?.trim()) {
      return items;
    }
    const newData = items?.filter(it =>
      get(it, pathDisplay)?.toLowerCase().includes(keySearch?.toLowerCase()),
    );
    return newData;
  }, [keySearch, items]);

  const onChangeSearch = (key: string) => {
    setKeySearch(key);
  };
  const onSubmit = () => {
    onSelect?.(selected);
    onRequestClose?.();
  };
  const handlePick = (item: any) => {
    setSelected(item);
  };

  const renderEmptyList = () => {
    if (emptyType == 'selection') {
      return (
        <AppButton
          onPress={() => {
            onSelect?.(keySearch);
            onRequestClose?.();
          }}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: ScaleSize(20),
            borderRadius: ScaleSize(10),
            borderWidth: 1,
            borderColor: Colors.gray07,
            paddingVertical: ScaleSize(10),
          }}
        >
          <Text>
            <Trans
              components={{ bold: <Text style={styles.searchKeyword} /> }}
              i18nKey="common.popup.choose_bank"
              shouldUnescape
              values={{ bank: keySearch }}
            />
          </Text>
        </AppButton>
      );
    }
    return <></>;
  };

  return (
    <View
      style={[styles.container, layout, { marginBottom: keyboardHeight }]}
      testID="selection-dialog"
      onLayout={e => {
        if (layout) {
          return;
        }
        if (displayData?.length > 0) {
          setLayout({
            width: e.nativeEvent?.layout?.width,
            height: e.nativeEvent?.layout?.height,
          });
        }
      }}
    >
      {title === undefined ? undefined : (
        <Text style={styles.title}>{title}</Text>
      )}
      {showSearchBar ? (
        <TextField
          // inputWrapperStyle={styles.pointPill}
          // keyboardType="number-pad"
          onChangeText={onChangeSearch}
          placeholder={t('common.search')}
          iconName="ic_search"
          // style={styles.pointPillText}
          // testID="point-usage-input"
          // value={`${formatCurrency(pointUsed)} ${t('point_usage.point_unit')}`}
        />
      ) : undefined}
      <ScrollView
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        style={styles.list}
      >
        {displayData?.length == 0 && renderEmptyList()}
        {displayData?.map((item, index) => {
          const value = get(item, pathSelected);
          const isSelected =
            typeof selected === 'string'
              ? selected == value
              : get(selected, pathSelected) == value;
          const isLast = index == displayData.length - 1;
          return (
            <AppButton
              activeOpacity={0.8}
              key={item.id}
              onPress={() => {
                handlePick(item);
              }}
              style={[styles.option, { borderBottomWidth: isLast ? 0 : 1 }]}
              testID={`selection-option-${item.id}`}
            >
              <Text style={styles.optionLabel}>{get(item, pathDisplay)}</Text>
              <View style={styles.checkSlot}>
                {isSelected ? (
                  <Image
                    color={CHECK_COLOR}
                    height={CHECK_ICON_SIZE}
                    name="ic_check"
                    type="svg"
                    width={CHECK_ICON_SIZE}
                  />
                ) : undefined}
              </View>
            </AppButton>
          );
        })}
      </ScrollView>
      <Button
        title={t('common.confirm')}
        onPress={onSubmit}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 17,
          right: 20,
          alignSelf: 'center',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  checkSlot: {
    height: CHECK_ICON_SIZE,
    width: CHECK_ICON_SIZE,
  },
  container: {
    // Shrink inside the bottom sheet card's maxHeight so the list gets a
    // bounded height and can actually scroll to the last item.
    flexShrink: 1,
    paddingHorizontal: ScaleSize(20),
    width: '100%',
  },
  list: {
    flexGrow: 0,
    flexShrink: 1,
    marginBottom: 50,
  },
  listContent: {
    gap: ScaleSize(8),
    paddingBottom: ScaleSize(8),
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: ScaleSize(12),
    borderColor: Colors.gray2,
  },
  optionLabel: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(16),
  },
  searchKeyword: {
    fontWeight: 'bold',
  },
  title: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(18),
    fontWeight: '700',
    marginBottom: ScaleSize(16),
    // textAlign: 'center',
  },
});

export default React.memo(Selection);
