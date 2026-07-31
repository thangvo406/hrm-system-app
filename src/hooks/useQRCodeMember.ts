import { useCallback, useEffect, useRef, useState } from 'react';
import QRCodeViewer, { QRCodeViewerMode } from '@dialogs/QRCodeViewer';
import AppNavigator from '@navigation/AppNavigator';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import { generateQRCodeMemberRequest } from '@services/slices/account/accountSlice';
import type { IResponseCreateQRCodeMember } from '@type/account';
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

export const useQRCodeMember = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<IResponseCreateQRCodeMember | undefined>();
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

  const onRefreshQrCode = (
    onRefreshed?: (data: IResponseCreateQRCodeMember) => void,
  ) => {
    dispatch(
      generateQRCodeMemberRequest({
        cpn: [],
        onSuccess: response => {
          setIsExpired(false);
          setData(response);
          onRefreshed?.(response);
        },
      }),
    );
  };

  useEffect(() => {
    onRefreshQrCode();
  }, [dispatch]);

  const onPressBarcode = () => {
    showQRCodeViewer('barcode', data?.qrImageBase64);
  };

  const onPressQR = () => {
    showQRCodeViewer('qr', data?.qrImageBase64);
  };

  return {
    currentWallet,
    data,
    isExpired,
    onPressBarcode,
    onPressQR,
    onPressScan,
    onRefresh: onRefreshQrCode,
  };
};
