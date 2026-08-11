import { AppButton, Image } from '@components';
import { ScaleSize } from '@kits/core';
import React, { useRef } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import imageNames from '@assets/images/names';

const TEXT_DARK = '#1A1A1A';
const TEXT_HINT = '#C4C4C4';
const LABEL_GREEN = '#3FA34D';
const LINE_GREEN = '#2DB34A';
const STRIP_BG = '#F1F8F0';
const CARD_SHADOW = 'rgba(23, 68, 33, 0.08)';
const DOC_ICON_SIZE = ScaleSize(48);
// Reserve the doc icon's footprint inside the row so the input + "구좌"
// suffix never slide underneath it, while the underline keeps full width.
const INPUT_ROW_ICON_INSET = DOC_ICON_SIZE + ScaleSize(8);

type Properties = {
  readonly amount: string;
  readonly expectedAmountText: string;
  readonly expectedUnitsText: string;
  readonly onAmountChange: (value: string) => void;
  readonly unitPriceText: string;
};

function UnitsInputCard({
  amount,
  expectedAmountText,
  expectedUnitsText,
  onAmountChange,
  unitPriceText,
}: Properties) {
  const { t } = useTranslation();
  const inputRef = useRef<TextInput>(null);

  const onPressInputRow = () => {
    inputRef.current?.focus();
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>
          {t('contribution_input.units_input_label')}
        </Text>
      </View>

      <AppButton
        onPress={onPressInputRow}
        style={styles.inputRow}
        testID="contribution-input-amount-row"
      >
        <TextInput
          keyboardType="number-pad"
          onChangeText={onAmountChange}
          placeholder="0"
          placeholderTextColor={TEXT_HINT}
          returnKeyType='done'
          ref={inputRef}
          style={styles.input}
          testID="contribution-input-amount-input"
          value={amount}
        />
        <Text style={styles.unitSuffix}>
          {t('contribution_input.unit_suffix')}
        </Text>
      </AppButton>
      <Image
        height={DOC_ICON_SIZE}
        name={imageNames.ic_doc_edit_green}
        pointerEvents="none"
        width={DOC_ICON_SIZE}
        style={{
          position: 'absolute',
          right: ScaleSize(20),
          top: ScaleSize(48),
        }}
      />
      <View style={styles.strip}>
        <View style={styles.stripColumn}>
          <Text style={styles.stripLabel}>
            {t('contribution_input.unit_price_label')}
          </Text>
          <Text style={styles.stripValue}>{unitPriceText}</Text>
        </View>
        <Text style={styles.dot}>•</Text>
        <View style={styles.stripColumnWide}>
          <Text style={styles.stripLabel}>
            {t('contribution_input.expected_amount_label')}
          </Text>
          <Text style={styles.stripValue}>{expectedAmountText}</Text>
        </View>
        <Text style={styles.equal}>=</Text>
        <View style={styles.stripColumn}>
          <Text style={styles.stripLabel}>
            {t('contribution_input.expected_units_label')}
          </Text>
          <Text style={styles.stripValue}>{expectedUnitsText}</Text>
        </View>
      </View>
    </View>
  );
}

export default React.memo(UnitsInputCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: ScaleSize(20),
    elevation: 4,
    padding: ScaleSize(20),
    shadowColor: CARD_SHADOW,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 1,
    shadowRadius: ScaleSize(12),
  },
  dot: {
    color: LINE_GREEN,
    fontSize: ScaleSize(14),
    marginHorizontal: ScaleSize(4),
  },
  equal: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '700',
    marginHorizontal: ScaleSize(4),
  },
  headerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    color: TEXT_DARK,
    flexShrink: 1,
    fontSize: ScaleSize(38),
    fontWeight: '800',
    minWidth: ScaleSize(48),
    padding: 0,
  },
  inputRow: {
    alignItems: 'baseline',
    borderBottomColor: LINE_GREEN,
    borderBottomWidth: ScaleSize(2),
    flexDirection: 'row',
    marginTop: ScaleSize(6),
    paddingBottom: ScaleSize(10),
    paddingRight: INPUT_ROW_ICON_INSET,
  },
  label: {
    color: TEXT_DARK,
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  strip: {
    alignItems: 'center',
    backgroundColor: STRIP_BG,
    borderRadius: ScaleSize(14),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ScaleSize(16),
    paddingHorizontal: ScaleSize(12),
    paddingVertical: ScaleSize(14),
  },
  stripColumn: {
    alignItems: 'center',
  },
  stripColumnWide: {
    alignItems: 'center',
    flex: 1,
  },
  stripLabel: {
    color: LABEL_GREEN,
    fontSize: ScaleSize(12),
    fontWeight: '600',
  },
  stripValue: {
    color: TEXT_DARK,
    fontSize: ScaleSize(15),
    fontWeight: '800',
    marginTop: ScaleSize(4),
  },
  unitSuffix: {
    color: TEXT_DARK,
    fontSize: ScaleSize(30),
    fontWeight: '800',
    // marginLeft: ScaleSize(8),
  },
});
