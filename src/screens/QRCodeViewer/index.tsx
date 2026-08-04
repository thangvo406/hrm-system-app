import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCodeViewerView from './QRCodeViewerView';
import { useQRCodeMember } from '@hooks';

const SCREEN_BG = '#FFFFFF';

function QRCodeViewer() {
  const insets = useSafeAreaInsets();
  const { data, onRefresh, onPressVoucher } = useQRCodeMember();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <QRCodeViewerView
        data={data}
        onRefresh={onRefresh}
        durationSeconds={data?.expiresIn}
        // onRequestClose={onRequestClose}
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
