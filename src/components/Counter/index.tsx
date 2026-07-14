/* eslint-disable react-hooks/set-state-in-effect */
import type { Ref } from 'react';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { ScaleSize } from '@kits/core';
import { Colors } from '@constants';
import { useTranslation } from 'react-i18next';
import React from 'react';

export type TCounterRef = {
  restart: (newExpiresIn?: number) => void;
};

type CounterProps = {
  readonly desc?: string;
  readonly expiresIn: number;
  readonly onOTPExpired: () => void;
  readonly ref?: Ref<TCounterRef>;
};

function Counter({
  expiresIn,
  onOTPExpired,
  desc = 'qr_code_payment.expires_in',
  ref = undefined,
}: CounterProps) {
  const { t } = useTranslation();
  const [remainingSeconds, setRemainingSeconds] = useState(expiresIn);
  const interval = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );

  const start = (seconds: number) => {
    setRemainingSeconds(seconds);
    clearInterval(interval.current);
    interval.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval.current);
          onOTPExpired?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    start(expiresIn);
    return () => {
      clearInterval(interval.current);
    };
  }, [expiresIn]);

  useImperativeHandle<TCounterRef, TCounterRef>(ref, () => ({
    restart: newExpiresIn => start(newExpiresIn ?? expiresIn),
  }));

  return (
    <Text style={styles.text}>{t(desc, { seconds: remainingSeconds })}</Text>
  );
}

export default React.memo(Counter);

const styles = StyleSheet.create({
  text: {
    color: Colors.gray1,
    fontSize: ScaleSize(13),
    marginTop: ScaleSize(12),
    textAlign: 'center',
  },
});
