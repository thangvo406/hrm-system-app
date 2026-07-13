/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { ScaleSize } from '@kits/core';
import { Colors } from '@constants';
import { useTranslation } from 'react-i18next';
import React from 'react';
type CounterProps = {
  readonly desc?: string;
  readonly expiresIn: number;
};

function Counter({
  expiresIn,
  desc = 'qr_code_payment.expires_in',
}: CounterProps) {
  const { t } = useTranslation();
  const [remainingSeconds, setRemainingSeconds] = useState(expiresIn);
  const interval = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );

  useEffect(() => {
    setRemainingSeconds(expiresIn);
    clearInterval(interval.current);
    interval.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(interval.current);
    };
  }, [expiresIn]);

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
