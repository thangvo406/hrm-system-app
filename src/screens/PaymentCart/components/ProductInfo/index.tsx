import Image from '@components/Image';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatCurrency } from '@utils/product';
import type { ProductCart } from '@type';
import React, { useState } from 'react';
import Animated, {
  FadeInUp,
  FadeOutDown,
  LinearTransition,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

const TEXT_DARK = '#1A1A1A';
const CARD_BG = '#FFFFFF';
const IMAGE_SIZE = ScaleSize(80);
const SECTION_TITLE = 'Selected Items';
const ANIM_DURATION = 200;

type ProductInfoProperties = {
  readonly items: readonly ProductCart[] | undefined;
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

function ProductInfo({ items }: ProductInfoProperties) {
  const [expanded, setExpanded] = useState(true);
  const hasItems = (items?.length ?? 0) > 0;

  const handleToggle = () => {
    setExpanded(prev => !prev);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleToggle}
        style={styles.header}
        testID="payment-product-info-toggle"
      >
        <Text style={styles.sectionTitle}>{SECTION_TITLE}</Text>
        {hasItems ? <ChevronIcon expanded={expanded} /> : undefined}
      </TouchableOpacity>

      {hasItems && expanded ? (
        <Animated.View
          entering={FadeInUp.duration(ANIM_DURATION)}
          exiting={FadeOutDown.duration(ANIM_DURATION)}
          layout={LinearTransition.duration(ANIM_DURATION)}
        >
          {items?.map(item => {
            return (
              <View style={styles.itemRow} key={item.id}>
                <Image
                  height={IMAGE_SIZE}
                  resizeMode="cover"
                  style={styles.itemImage}
                  url={item.productThumbnailUrl?.fileUrl}
                  width={IMAGE_SIZE}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.productName}</Text>
                  {item.selectedAttributes?.map(attribute => {
                    return (
                      <Text
                        style={styles.itemDescription}
                        key={attribute.attributeName}
                      >
                        {attribute.attributeName}
                      </Text>
                    );
                  })}
                  <Text style={styles.itemPrice}>
                    {formatCurrency(item.totalAmount)}
                  </Text>
                </View>
              </View>
            );
          })}
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
});
