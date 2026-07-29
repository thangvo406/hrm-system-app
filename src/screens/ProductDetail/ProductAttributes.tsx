import AppButton from '@components/AppButton';
import CheckBox from '@components/CheckBox';
import RadioButton from '@components/RadioButton';
import { Colors } from '@constants';
import { AttributeType } from '@constants/config';
import { ScaleSize } from '@kits/core';
import { IAttributeDetail, ISelectedAttributeItem } from '@type';
import { formatCurrency } from '@utils/product';
import { debounce } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
const CARD_BG = '#FFFFFF';
const CARD_RADIUS = ScaleSize(12);
const SECTION_BG = '#F2F2F2';
const TITLE_COLOR = '#1A1A1A';

type ProductAttributesProps = {
  readonly data: IAttributeDetail[];
  readonly onChangeQuantity: (parent: any, attr: any, quantity: number) => void;
  readonly onSelect: (
    attribute: IAttributeDetail,
    itemId: number,
    quantity: number,
  ) => void;
  readonly selected: Record<number, ISelectedAttributeItem[]>;
};

const QuantityStepper = ({
  item,
  selectedIds,
  parent,
  onChangeQuantity,
  index,
}: any) => {
  const [errorMaxQuantity, setErrorMaxQuantity] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { t } = useTranslation();
  const flag = useRef(0);

  useEffect(() => {
    const selected = selectedIds?.find?.((it: any) => it.itemId == item?.id);
    if (selected?.quantity) {
      setQuantity(selected?.quantity);
    } else {
      flag.current = 2;
    }
  }, [item]);

  useEffect(() => {
    if (flag.current < 2) {
      flag.current++;
      return;
    }
    const debounceId = debounce(() => {
      onChangeQuantity?.(parent, item, quantity);
    }, 350);
    debounceId();
    return () => debounceId.cancel();
  }, [quantity, index]);

  const _onChangeQuantity = (type: string) => () => {
    const newQuantity = Math.max(
      0,
      type === 'plus' ? quantity + 1 : quantity - 1,
    );

    if (newQuantity > item.maxQty) {
      setErrorMaxQuantity(
        t('product_detail.max_quantity_error', { count: item.maxQty }),
      );
      return;
    }
    setQuantity(newQuantity);
    setErrorMaxQuantity('');
  };

  return (
    <View
      style={{
        alignItems: 'center',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text style={styles.price}>{formatCurrency(item.price)}</Text>
        <View style={styles.stepper}>
          <AppButton style={styles.stepperIcon} onPress={_onChangeQuantity('')}>
            <View style={styles.stepperBar} />
          </AppButton>
          <Text style={styles.stepperValue}>{quantity}</Text>
          <AppButton
            style={styles.stepperIcon}
            onPress={_onChangeQuantity('plus')}
          >
            <View style={styles.stepperBar} />
            <View style={[styles.stepperBar, styles.stepperBarVertical]} />
          </AppButton>
        </View>
      </View>
      {!!errorMaxQuantity && (
        <Text style={styles.errorMaxQuantity}>{errorMaxQuantity}</Text>
      )}
    </View>
  );
};

function ProductAttributes({
  data,
  onSelect,
  selected,
  onChangeQuantity,
}: ProductAttributesProps) {
  return (
    <View style={styles.container}>
      {data?.map(attribute => {
        const Component =
          attribute.type === AttributeType.SINGLE ? RadioButton : CheckBox;
        const isShowPrice = attribute.type != AttributeType.MULTIPLE_CHOICE;
        const selectedIds = selected[attribute.id] ?? [];
        return (
          <View key={attribute.id} style={styles.card}>
            <Text style={styles.titleSection}>{attribute.name}</Text>
            <View style={styles.itemsWrapper}>
              {attribute.items.map(item => (
                <Component
                  key={item.id}
                  label={item.name}
                  onPress={() => onSelect(attribute, item.id, 1)}
                  rightLabel={isShowPrice ? formatCurrency(item.price) : ''}
                  rightComponent={
                    isShowPrice ? undefined : (
                      <QuantityStepper
                        item={item}
                        onChangeQuantity={onChangeQuantity}
                        parent={attribute}
                        selectedIds={selectedIds}
                      />
                    )
                  }
                  selected={selectedIds.some(entry => entry.itemId === item.id)}
                  style={styles.radioItem}
                />
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: CARD_BG,
    borderCurve: 'continuous',
    borderRadius: CARD_RADIUS,
    gap: ScaleSize(12),
    padding: ScaleSize(16),
  },
  container: {
    backgroundColor: SECTION_BG,
    flex: 1,
    gap: ScaleSize(12),
    padding: ScaleSize(16),
  },
  errorMaxQuantity: {
    color: 'red',
    fontSize: ScaleSize(14),
    fontWeight: '400',
    marginTop: ScaleSize(8),
  },
  itemsWrapper: {
    gap: ScaleSize(12),
    paddingLeft: ScaleSize(8),
  },
  radioItem: {
    paddingVertical: ScaleSize(4),
  },
  titleSection: {
    color: TITLE_COLOR,
    fontSize: ScaleSize(16),
    fontWeight: 'bold',
  },
  price: {
    color: '#1A1A1A',
    fontSize: ScaleSize(16),
    marginLeft: ScaleSize(10),
  },
  stepper: {
    alignItems: 'center',
    alignSelf: 'stretch',
    borderColor: Colors.primary,
    borderRadius: ScaleSize(24),
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop: ScaleSize(12),
    // paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(5),
    width: ScaleSize(90),
    marginLeft: ScaleSize(12),
  },
  stepperBar: {
    backgroundColor: '#5BB85C',
    borderRadius: ScaleSize(1.5),
    height: ScaleSize(2.5),
    width: ScaleSize(14),
  },
  stepperBarVertical: {
    position: 'absolute',
    transform: [{ rotate: '90deg' }],
  },
  stepperIcon: {
    alignItems: 'center',
    height: ScaleSize(20),
    justifyContent: 'center',
    width: ScaleSize(20),
    flex: 1,
  },
  stepperValue: {
    color: '#1A1A1A',
    fontSize: ScaleSize(14),
    fontWeight: '700',
  },
});

export default React.memo(ProductAttributes);
