import CheckBox from '@components/CheckBox';
import RadioButton from '@components/RadioButton';
import { ScaleSize } from '@kits/core';
import { AttributeDetail } from '@type';
import { formatCurrency } from '@utils/product';
import { StyleSheet, Text, View } from 'react-native';

const CARD_BG = '#FFFFFF';
const CARD_RADIUS = ScaleSize(12);
const SECTION_BG = '#F2F2F2';
const TITLE_COLOR = '#1A1A1A';

type ProductAttributesProps = {
  readonly data: AttributeDetail[];
  readonly onSelect: (attribute: AttributeDetail, itemId: number) => void;
  readonly selected: Record<number, number[]>;
};

function ProductAttributes({
  data,
  onSelect,
  selected,
}: ProductAttributesProps) {
  return (
    <View style={styles.container}>
      {data?.map(attribute => {
        const Component = attribute.type === 'RADIO' ? RadioButton : CheckBox;
        const selectedIds = selected[attribute.id] ?? [];
        return (
          <View key={attribute.id} style={styles.card}>
            <Text style={styles.titleSection}>{attribute.name}</Text>
            <View style={styles.itemsWrapper}>
              {attribute.items.map(item => (
                <Component
                  key={item.id}
                  label={item.name}
                  onPress={() => onSelect(attribute, item.id)}
                  rightLabel={formatCurrency(item.price)}
                  selected={selectedIds.includes(item.id)}
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
});

export default ProductAttributes;
