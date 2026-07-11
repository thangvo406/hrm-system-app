import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import type { AttributeCart, ProductCart } from '@type';
import React, { useEffect, useRef, useState } from 'react';
import Animated, {
  FadeInUp,
  FadeOutDown,
  LinearTransition,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { AppButton, Image } from '@components';
import AppNavigator from '@navigation/AppNavigator';
import Information from '@dialogs/Information';
import debounce from 'lodash/debounce';
import type { DebouncedFunc } from 'lodash';
import imageNames from '@assets/images/names';
import { useTranslation } from 'react-i18next';

const TEXT_DARK = '#1A1A1A';
const CARD_BG = '#FFFFFF';
const IMAGE_SIZE = ScaleSize(80);
const SECTION_TITLE = 'Selected Items';
const ANIM_DURATION = 200;
const STEPPER_HEIGHT = ScaleSize(28);
const STEPPER_BTN_WIDTH = ScaleSize(36);
const STEPPER_ICON_COLOR = '#AAAAAA';
const DEBOUNCE_REMOVE_MS = 250;

type ProductInfoProperties = {
  readonly items: readonly ProductCart[] | undefined;
  readonly onChangeQuantity: (item: ProductCart) => void;
};

function ChevronIcon({ expanded }: { readonly expanded: boolean }) {
  const rotation = useDerivedValue(() =>
    withTiming(expanded ? 0 : 180, { duration: ANIM_DURATION }),
  );
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  return (
    <Animated.Text style={[styles.chevron, animatedStyle]}>⌃</Animated.Text>
  );
}

function ProductInfo({ onChangeQuantity, items }: ProductInfoProperties) {
  const {t} = useTranslation()
  const [expanded, setExpanded] = useState(true);
  const hasItems = (items?.length ?? 0) > 0;
  const [products, setProducts] = useState<ProductCart[]>(
    items ? [...items] : [],
  );
  const debounceShowPopup = useRef<DebouncedFunc<() => void> | undefined>(
    undefined,
  );

  useEffect(() => {
    setProducts(items);
  }, [items]);

  const handleToggle = () => {
    setExpanded(prev => !prev);
  };

  const _onChangeQuantity =
    (type: string, index: number, quantity: number) => () => {
      const newQuantity = Math.max(
        0,
        type === 'plus' ? quantity + 1 : quantity - 1,
      );

      if (debounceShowPopup.current) {
        return;
      }
      const newItems = [...products];
      newItems[index] = { ...newItems[index], quantity: newQuantity };
      if (newQuantity === 0) {
        debounceShowPopup.current = debounce(() => {
          debounceShowPopup.current = undefined;
          AppNavigator.showDialog({
            screen: Information,
            title: 'Bạn muốn xoá cart này?',
            cancelTitle: 'No',
            confirmTitle: 'Confirm',
            onConfirm: () => {
              onChangeQuantity(newItems[index]);
            },
          });
        }, DEBOUNCE_REMOVE_MS);
        debounceShowPopup.current();
        return;
      }

      setProducts(newItems);
      onChangeQuantity(newItems[index]);
    };

  return (
    <View style={styles.card}>
      <AppButton
        activeOpacity={0.7}
        onPress={handleToggle}
        style={styles.header}
        testID="payment-product-info-toggle"
      >
        <Text style={styles.sectionTitle}>{SECTION_TITLE}</Text>
        {hasItems ? <ChevronIcon expanded={expanded} /> : undefined}
      </AppButton>

      {hasItems && expanded ? (
        <Animated.View
          entering={FadeInUp.duration(ANIM_DURATION)}
          exiting={FadeOutDown.duration(ANIM_DURATION)}
          layout={LinearTransition.duration(ANIM_DURATION)}
        >
          {products.map((item: ProductCart, index: number) => (
            <View style={styles.itemRow} key={item.id}>
              <Image
                height={IMAGE_SIZE}
                resizeMode="cover"
                name={imageNames.img_product_default}
                style={styles.itemImage}
                url={item.productThumbnailUrl?.fileUrl}
                width={IMAGE_SIZE}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.productName}</Text>

                <View style={styles.stepper}>
                  <AppButton
                    onPress={_onChangeQuantity('minus', index, item.quantity)}
                    style={styles.stepperBtn}
                    testID={`stepper-minus-${item.id}`}
                  >
                    <Text style={styles.stepperIcon}>−</Text>
                  </AppButton>
                  <Text style={styles.stepperCount}>{item.quantity}</Text>
                  <AppButton
                    onPress={_onChangeQuantity('plus', index, item.quantity)}
                    style={styles.stepperBtn}
                    testID={`stepper-plus-${item.id}`}
                  >
                    <Text style={styles.stepperIcon}>+</Text>
                  </AppButton>
                </View>

                {item.selectedAttributes?.map((attribute: AttributeCart) => (
                  <Text
                    style={styles.itemDescription}
                    key={attribute.attributeId}
                  >
                    {attribute.attributeName}
                  </Text>
                ))}
                <Text style={styles.itemPrice}>
                  {t('common.display_price', {amount: formatCurrency(item.unitPrice)})}
                </Text>
              </View>
            </View>
          ))}
        </Animated.View>
      ) : undefined}
    </View>
  );
}

export default React.memo(ProductInfo);

const styles = StyleSheet.create({
  card: {
    backgroundColor: CARD_BG,
    borderRadius: ScaleSize(12),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(16),
  },
  chevron: {
    color: TEXT_DARK,
    fontSize: ScaleSize(18),
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemDescription: {
    color: Colors.gray1,
    fontSize: ScaleSize(12),
    marginTop: ScaleSize(2),
  },
  itemImage: {
    borderRadius: ScaleSize(8),
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: ScaleSize(12),
  },
  itemName: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '600',
  },
  itemPrice: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '700',
    marginTop: ScaleSize(6),
  },
  itemRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: ScaleSize(12),
  },
  sectionTitle: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '700',
  },
  stepper: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderColor: Colors.primary,
    borderRadius: STEPPER_HEIGHT / 2,
    borderWidth: 1.5,
    flexDirection: 'row',
    height: STEPPER_HEIGHT,
    marginTop: ScaleSize(6),
    overflow: 'hidden',
  },
  stepperBtn: {
    alignItems: 'center',
    height: STEPPER_HEIGHT,
    justifyContent: 'center',
    width: STEPPER_BTN_WIDTH,
  },
  stepperCount: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '700',
    minWidth: ScaleSize(28),
    textAlign: 'center',
  },
  stepperIcon: {
    color: STEPPER_ICON_COLOR,
    fontSize: ScaleSize(18),
    fontWeight: '400',
    lineHeight: ScaleSize(22),
  },
});
