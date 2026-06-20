import imageNames from '@assets/images/names';
import { Button, Image, TextField } from '@components';
import { Product } from '@hooks';
import { ScaleSize } from '@kits/core';
import { ProductUtils } from '@utils';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

const IMAGE_SIZE = ScaleSize(64);
const STEPPER_MIN_WIDTH = ScaleSize(132);
const STEPPER_BUTTON_HIT = ScaleSize(32);
const STEPPER_PADDING_V = ScaleSize(8);
const STEPPER_BORDER_WIDTH = 1.5;
const CARD_PADDING = ScaleSize(16);
const CARD_RADIUS = ScaleSize(12);
const QUANTITY_FONT_SIZE = ScaleSize(18);
const PRICE_FONT_SIZE = ScaleSize(18);
const NAME_FONT_SIZE = ScaleSize(15);

const PRICE_COLOR = '#1976D2';
const NAME_COLOR = '#1A1A1A';
const STEPPER_TEXT_COLOR = '#5A5A5A';
const CARD_BG = '#FFFFFF';

type SelectQualityProps = {
  readonly data?: Product;
  readonly onRequestClose?: () => void;
  readonly onSubmit?: (quantity: number, note: string) => void;
};

function SelectQuality({ data, onRequestClose = undefined, onSubmit = undefined }: SelectQualityProps) {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState('')

  const handleDecrement = () => {
    setQuantity(prev => {
      const next = prev - 1;
      //   onChange(next);
      return next;
    });
  };

  const handleIncrement = () => {
    setQuantity(prev => {
      const next = prev + 1;
      //   onChange(next);
      return next;
    });
  };

  const handleSubmit = () => {
    onRequestClose?.();
    onSubmit?.(quantity, note)
  };
 
  return (
    <View
      //   onTouchStart={onRequestClose}
      style={styles.card}
      testID="select-quaility-card"
    >
      <View style={styles.info}>
        <Image
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          style={styles.image}
          url={data?.thumbnail?.fileUrl}
          name={imageNames.img_product_default}
        />
        <Text
          numberOfLines={2}
          style={styles.name}
          testID="select-quaility-name"
        >
          {data?.name}
        </Text>
      </View>

      <View
        style={[
          styles.info,
          { justifyContent: 'space-between', alignItems: 'center'},
        ]}
      >
        <Text style={styles.price} testID="select-quaility-price">
          {ProductUtils.formatCurrency(data?.price * quantity)}
        </Text>
        <View style={styles.stepper}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleDecrement}
            style={styles.stepperButton as ViewStyle}
            testID="select-quaility-decrement"
          >
            <Text style={styles.stepperSign}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantity} testID="select-quaility-quantity">
            {quantity}
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleIncrement}
            style={styles.stepperButton as ViewStyle}
            testID="select-quaility-increment"
          >
            <Text style={styles.stepperSign}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TextField
       autoCapitalize="none"
       onChangeText={setNote}
       placeholder='Note for your order'
       returnKeyType="done"
       submitBehavior="submit"
       testID="choose-quantity-input"
      //  value={values.email}
      
      />

      <Button
        onPress={handleSubmit}
        style={styles.submit as ViewStyle}
        testID="select-quaility-submit"
        title={t('common.confirm')}
        type="primary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    // alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CARD_BG,
    borderRadius: CARD_RADIUS,
    // flexDirection: 'row',
    gap: ScaleSize(12),
    padding: CARD_PADDING,
  },
  image: {
    backgroundColor: '#F2F2F2',
    borderRadius: ScaleSize(8),
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
  },
  info: {
    // flex: 1,
    flexDirection: 'row',
    gap: ScaleSize(6),
    alignItems: 'center',
  },
  name: {
    color: NAME_COLOR,
    fontSize: NAME_FONT_SIZE,
    fontWeight: '700',
    lineHeight: ScaleSize(20),
  },
  price: {
    color: PRICE_COLOR,
    fontSize: PRICE_FONT_SIZE,
    fontWeight: '700',
  },
  quantity: {
    color: STEPPER_TEXT_COLOR,
    fontSize: QUANTITY_FONT_SIZE,
    fontWeight: '700',
    minWidth: ScaleSize(24),
    textAlign: 'center',
  },
  stepper: {
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: '#E0E0E0',
    borderRadius: ScaleSize(8),
    borderWidth: STEPPER_BORDER_WIDTH,
    flexDirection: 'row',
    minWidth: STEPPER_MIN_WIDTH,
    paddingHorizontal: ScaleSize(5),
    paddingVertical: STEPPER_PADDING_V,
    justifyContent: 'space-between',
  },
  stepperButton: {
    alignItems: 'center',
    height: STEPPER_BUTTON_HIT,
    justifyContent: 'center',
    width: STEPPER_BUTTON_HIT,
  },
  stepperSign: {
    color: STEPPER_TEXT_COLOR,
    fontSize: ScaleSize(22),
    fontWeight: '500',
  },
  submit: {
    height: ScaleSize(44),
    marginTop: ScaleSize(4),
  },
});

export default React.memo(SelectQuality);
