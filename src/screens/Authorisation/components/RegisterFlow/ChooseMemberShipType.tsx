import { Button } from '@components';
import TextField from '@components/TextField';
import RegisterHeader from './Header';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { KeyboardEvent } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ScaleSize } from '@kits/core';
import { Colors } from '@constants';
import { DeviceUtils } from '@kits/core/utils';

const { isIOS, isIPadOrTablet } = DeviceUtils;
const PRIMARY_COLOR = '#5BB85C';
const BORDER_COLOR_SELECTED = '#5BB85C';
const BORDER_COLOR_DEFAULT = '#CCCCCC';
const KEYBOARD_ANIMATION_DURATION_MS = 250;
const NOOP = () => undefined;
const RADIO_OUTER_SIZE = ScaleSize(20);
const RADIO_INNER_SIZE = ScaleSize(10);
const TEXT_COLOR = '#1A1A1A';

export type MembershipOption = {
  readonly id: string;
  readonly label: string;
  readonly desc: string;
  readonly other?: boolean;
};

type ChooseMemberShipTypeProps = {
  readonly disabled?: boolean;
  readonly showBtnBack?: boolean;
  readonly onBack?: () => void;
  readonly onSelectMembership: (id: string) => void;
  readonly onSubmit: (data: any, reason?: string) => void;
  readonly options: readonly MembershipOption[];
};

function ChooseMemberShipType({
  disabled = false,
  onBack = NOOP,
  onSelectMembership,
  onSubmit,
  options,
  showBtnBack = false,
}: ChooseMemberShipTypeProps) {
  const { t } = useTranslation();
  const [itemSelected, setItemSelected] = useState<
    MembershipOption | undefined
  >(undefined);
  const [otherReason, setOtherReason] = useState('');
  const keyboardOffset = useRef(new Animated.Value(0)).current;

  // "Other" memberships need a free-text reason before the flow can continue.
  const requireReason = itemSelected?.other === true;
  const enabledSubmit =
    !disabled &&
    itemSelected !== undefined &&
    (!requireReason || !!otherReason.trim());

  const handleSubmit = () => {
    if (!enabledSubmit) {
      return;
    }
    onSubmit?.({
      item: itemSelected,
      otherReason,
    });
  };

  useEffect(() => {
    if (isIPadOrTablet()) {
      return;
    }
    const showEvent = isIOS() ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = isIOS() ? 'keyboardWillHide' : 'keyboardDidHide';

    // Shift the content up by exactly the keyboard height so the focused
    // reason input stays visible.
    const onShow = (event: KeyboardEvent) => {
      Animated.timing(keyboardOffset, {
        toValue: -event.endCoordinates.height / 2,
        duration: event.duration || KEYBOARD_ANIMATION_DURATION_MS,
        useNativeDriver: true,
      }).start();
    };

    const onHide = (event: KeyboardEvent) => {
      Animated.timing(keyboardOffset, {
        toValue: 0,
        duration: event.duration || KEYBOARD_ANIMATION_DURATION_MS,
        useNativeDriver: true,
      }).start();
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <RegisterHeader onBack={onBack} showBtnBack={showBtnBack} />

      <View style={styles.content}>
        <Text style={styles.title}>{t('choose_membership.title')}</Text>
        <Text style={[styles.desc, { marginLeft: 0 }]}>
          {t('choose_membership.desc')}
        </Text>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{
            marginTop: ScaleSize(10),
          }}
        >
          <Animated.View
            style={[{ flex: 1, transform: [{ translateY: keyboardOffset }] }]}
          >
            {options.map((option, index) => {
              const isSelected = option.id === itemSelected?.id;
              const showReasonInput = isSelected && option.other === true;
              return (
                <React.Fragment key={option.id}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      onSelectMembership?.(option.id);
                      setItemSelected(option);
                      setOtherReason('');
                    }}
                    style={[
                      styles.option,
                      index === 0 && styles.optionFirst,
                      isSelected && styles.optionSelected,
                      showReasonInput && styles.optionWithReason,
                    ]}
                    testID={`choose-membership-option-${option.id}`}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        isSelected && styles.radioOuterSelected,
                      ]}
                    >
                      {isSelected ? (
                        <View style={styles.radioInner} />
                      ) : undefined}
                    </View>
                    <View>
                      <Text style={styles.optionLabel}>{t(option.label)}</Text>
                      <Text style={styles.desc}>{t(option.desc)}</Text>
                    </View>
                  </TouchableOpacity>

                  {showReasonInput ? (
                    <View
                      style={styles.reasonCard}
                      testID={`choose-membership-reason-${option.id}`}
                    >
                      <Text style={styles.reasonLabel}>
                        {t('choose_membership.other_reason_label')}
                      </Text>
                      <TextField
                        inputWrapperStyle={styles.reasonInput}
                        onChangeText={setOtherReason}
                        onSubmitEditing={handleSubmit}
                        returnKeyType="done"
                        placeholder={t(
                          'choose_membership.other_reason_placeholder',
                        )}
                        testID={`choose-membership-reason-input-${option.id}`}
                        value={otherReason}
                      />
                    </View>
                  ) : undefined}
                </React.Fragment>
              );
            })}
          </Animated.View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <View
          style={{
            width: '100%',
            height: ScaleSize(10),
            backgroundColor: '#F0F0F0',
            marginBottom: ScaleSize(30),
          }}
        />
        <Button
          disabled={!enabledSubmit}
          onPress={handleSubmit}
          style={{
            width: '90%',
            alignSelf: 'center',
          }}
          testID="choose-membership-next"
          title={t('choose_membership.next')}
          type="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: ScaleSize(24),
    paddingTop: ScaleSize(32),
  },
  footer: {
    paddingBottom: ScaleSize(24),
    paddingTop: ScaleSize(12),
  },
  option: {
    alignItems: 'center',
    borderColor: BORDER_COLOR_DEFAULT,
    borderRadius: ScaleSize(12),
    borderWidth: 1.5,
    flexDirection: 'row',
    marginBottom: ScaleSize(30),
    paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(30),
  },
  optionFirst: {
    marginTop: ScaleSize(40),
  },
  optionWithReason: {
    // Pull the reason card up so it reads as part of the selected option.
    marginBottom: ScaleSize(12),
  },
  reasonCard: {
    borderColor: BORDER_COLOR_SELECTED,
    borderRadius: ScaleSize(12),
    borderWidth: 1.5,
    marginBottom: ScaleSize(30),
    paddingBottom: ScaleSize(10),
    paddingHorizontal: ScaleSize(20),
    paddingTop: ScaleSize(16),
  },
  reasonInput: {
    marginBottom: 0,
  },
  reasonLabel: {
    color: PRIMARY_COLOR,
    fontSize: ScaleSize(16),
    fontWeight: 'bold',
    marginBottom: ScaleSize(10),
  },
  optionLabel: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(16),
    marginLeft: ScaleSize(14),
    marginBottom: ScaleSize(4),
    fontWeight: 'bold',
  },
  desc: {
    color: Colors.gray5,
    fontSize: ScaleSize(15),
    marginLeft: ScaleSize(14),
  },
  optionSelected: {
    borderColor: BORDER_COLOR_SELECTED,
  },
  radioInner: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: RADIO_INNER_SIZE / 2,
    height: RADIO_INNER_SIZE,
    width: RADIO_INNER_SIZE,
  },
  radioOuter: {
    alignItems: 'center',
    borderColor: BORDER_COLOR_DEFAULT,
    borderRadius: RADIO_OUTER_SIZE / 2,
    borderWidth: 2,
    height: RADIO_OUTER_SIZE,
    justifyContent: 'center',
    width: RADIO_OUTER_SIZE,
  },
  radioOuterSelected: {
    borderColor: PRIMARY_COLOR,
  },
  title: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(26),
    fontWeight: '700',
    marginBottom: ScaleSize(40),
  },
});

export default React.memo(ChooseMemberShipType);
