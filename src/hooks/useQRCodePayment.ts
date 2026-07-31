/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useRef, useState } from 'react';

import QRCodeViewer, { QRCodeViewerMode } from '@dialogs/QRCodeViewer';
import AppNavigator from '@navigation/AppNavigator';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import { generateQRCodePayRequest } from '@services/slices/payment/paymentSlice';
import type { IGenerateQRCodeResponse } from '@type/payment';
import {
  setBrightnessLevel,
  resetBrightness,
} from '@reeq/react-native-device-brightness';
import { useFocusEffect } from '@react-navigation/native';


const showQRCodeViewer = (mode: QRCodeViewerMode, value?: string) => {
  AppNavigator.showDialog({
    screen: QRCodeViewer as never,
    isFullScreen: true,
    overlayColor: 'rgba(0,0,0,0.7)',
    mode,
    transparent: true,
    value,
  });
};

const onPressScan = () => {
  // TODO: navigate to QR scanner screen
};

export const useQRCodePayment = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<IGenerateQRCodeResponse | undefined>();
  const timeOutExpired = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const [isExpired, setIsExpired] = useState(false);
  const currentWallet = useAppSelector(AccountSelector.getCurrentWallet);

  useFocusEffect(
    useCallback(() => {
      setBrightnessLevel(1);
      return () => {
        resetBrightness();
      };
    }, []),
  );

  useEffect(() => {
    if (!data) {
      return;
    }
    setIsExpired(false);
    timeOutExpired.current = setTimeout(
      () => {
        setIsExpired(true);
      },
      (data.expiresIn || 1) * 1000,
    );

    return () => {
      clearTimeout(timeOutExpired.current);
    };
  }, [data]);

  const onRefreshQrCode = () => {
    dispatch(
      generateQRCodePayRequest({
        onSuccess: response => {
          setIsExpired(false);
          setData(response);
        },
      }),
    );
  };

  useEffect(() => {
    onRefreshQrCode();
  }, [dispatch]);

  const onPressBarcode = () => {
    showQRCodeViewer('barcode', data?.qrData);
  };

  const onPressQR = () => {
    showQRCodeViewer('qr', data?.qrData);
  };

  return {
    currentWallet,
    data,
    isExpired,
    onPressBarcode,
    onPressQR,
    onPressScan,
    onRefreshQrCode,
  };
};
