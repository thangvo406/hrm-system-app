import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppNavigator from '@navigation/AppNavigator';
import QRCodeViewerView from './QRCodeViewerView';
import { useQRCodeMember } from '@hooks';

const SCREEN_BG = '#FFFFFF';

const onRequestClose = () => {
  AppNavigator.goBack();
};

function QRCodeViewer() {
  const insets = useSafeAreaInsets();
  const { data, onRefresh } = useQRCodeMember();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <QRCodeViewerView
        data={data}
        onRefresh={onRefresh}
        showPayOther={false}
        durationSeconds={data?.expiresIn}
        onRequestClose={onRequestClose}
        titleKey="qr_code_member.title"
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
