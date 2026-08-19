import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCodeViewerView, {
  QRCodeViewerViewHandle,
} from '@components/QRCodeViewerView';
import { useQRCodeMember } from '@hooks';
import { useFocusEffect } from '@react-navigation/native';
import AppNavigator from '@navigation/AppNavigator';
import type { Paths } from '@navigation/paths';
import type { TabScreenProps } from '@navigation/types';
import { useCallback, useRef } from 'react';

const SCREEN_BG = '#FFFFFF';

function QRCodeViewer(props: TabScreenProps<Paths.QRCodeViewer>) {
  const insets = useSafeAreaInsets();
  const { isTab } = AppNavigator.getParams(props);
  const { data, profile, onRefresh, onPressVoucher } = useQRCodeMember();
  const qrCodeRef = useRef<QRCodeViewerViewHandle>(null);
  useFocusEffect(
    useCallback(() => {
      qrCodeRef.current?.setMounted(true);
      qrCodeRef.current?.checkRefresh();

      return () => {
        qrCodeRef.current?.setMounted(false);
      };
    }, []),
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <QRCodeViewerView
        data={data}
        hideBtnBack={isTab}
        ref={qrCodeRef}
        onRefresh={onRefresh}
        durationSeconds={data?.expiresIn}
        // onRequestClose={onRequestClose}
        titleVoucher={profile?.fullName}
        subtitle={profile?.email}
        titleKey="qr_code_member.title"
        showBtnVoucher
        onPressVoucher={onPressVoucher}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: SCREEN_BG,
    flex: 1,
  },
});

export default QRCodeViewer;
