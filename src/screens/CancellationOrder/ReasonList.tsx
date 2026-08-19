import type {
  CancelReasonId,
  CancelReasonItem,
} from '@hooks/useCancellationOrder';

import { AppButton, Image, TextField } from '@components';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const CHECK_ICON_SIZE = ScaleSize(13);
const CHECK_SIZE = ScaleSize(22);
const OTHER_REASON_MAX_LENGTH = 200;
const REASON_ICON_SIZE = ScaleSize(22);

type Properties = {
  readonly onChangeOtherReason: (text: string) => void;
  readonly onPressReason: (item: CancelReasonItem) => () => void;
  readonly otherReason: string;
  readonly reasons: readonly CancelReasonItem[];
  readonly selected: CancelReasonId;
};

function ReasonList({
  onChangeOtherReason,
  onPressReason,
  otherReason,
  reasons,
  selected,
}: Properties) {
  const { t } = useTranslation();

  return (
    <View style={styles.list}>
      {reasons.map(reason => {
        const isSelected = reason.id === selected;
        return (
          <React.Fragment key={reason.id}>
            <AppButton
              onPress={onPressReason(reason)}
              style={[styles.option, isSelected && styles.optionSelected]}
              testID={`cancellation-order-reason-${reason.id}`}
            >
              <Image
                color={isSelected ? Colors.green02 : Colors.gray17}
                height={REASON_ICON_SIZE}
                name={reason.icon}
                type="svg"
                width={REASON_ICON_SIZE}
              />

              <Text style={[styles.label, isSelected && styles.labelSelected]}>
                {t(reason.label)}
              </Text>

              {isSelected ? (
                <View style={styles.check}>
                  <Image
                    color={Colors.white}
                    height={CHECK_ICON_SIZE}
                    name="ic_check"
                    type="svg"
                    width={CHECK_ICON_SIZE}
                  />
                </View>
              ) : undefined}
            </AppButton>

            {isSelected && reason.id === 'OTHER' ? (
              <TextField
                maxLength={OTHER_REASON_MAX_LENGTH}
                multiLine
                autoFocus
                onChangeText={onChangeOtherReason}
                placeholder={t('cancellation_order.other_placeholder')}
                testID="cancellation-order-other-reason"
                value={otherReason}
              />
            ) : undefined}
          </React.Fragment>
        );
      })}
    </View>
  );
}

export default React.memo(ReasonList);

const styles = StyleSheet.create({
  check: {
    alignItems: 'center',
    backgroundColor: Colors.green02,
    borderRadius: CHECK_SIZE / 2,
    height: CHECK_SIZE,
    justifyContent: 'center',
    width: CHECK_SIZE,
  },
  label: {
    color: Colors.black01,
    flex: 1,
    fontSize: ScaleSize(15),
    fontWeight: '600',
    marginLeft: ScaleSize(14),
  },
  labelSelected: {
    color: Colors.green01,
    fontWeight: '700',
  },
  list: {
    gap: ScaleSize(10),
  },
  option: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: Colors.gray19,
    borderRadius: ScaleSize(14),
    borderWidth: ScaleSize(1),
    flexDirection: 'row',
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(15),
  },
  optionSelected: {
    backgroundColor: Colors.green11,
    borderColor: Colors.green02,
  },
});
