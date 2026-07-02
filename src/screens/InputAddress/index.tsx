import { ScaleSize } from '@kits/core';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useInputAddress } from '@hooks';
import AddressCard from './components/AddressCard';
import Button from '@components/Button';
import HeaderDetail from '@components/HeaderDetail';
import AppNavigator from '@navigation/AppNavigator';
import TextField from '@components/TextField';
import EmptyView from '@components/EmptyView';
import imageNames from '@assets/images/names';
import { Colors } from '@constants';

const TEXT_COLOR = '#1A1A1A';
const TEXT_MUTED = '#9E9E9E';
const BORDER_COLOR = '#E0E0E0';

function InputAddress(props: any) {
  const { t } = useTranslation();
  const inssets = useSafeAreaInsets();
  const { addressRecent } = AppNavigator.getParams(props);
  const {
    address,
    loading,
    onConfirm,
    onSelectAddress,
    selectedAddress,
    setAddress,
    setDetailAddress,
    suggestions,
  } = useInputAddress();

  return (
    <View style={[styles.container, { paddingBottom: inssets.bottom }]}>
      <HeaderDetail title={t('input_address.title')} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('input_address.previous_address_title')}
          </Text>
          <Text style={styles.previousAddress}>
            {addressRecent?.address_name || '--'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('input_address.new_address_title')}
          </Text>
          <TextField
            iconName="ic_map_pin"
            label=""
            showClear
            onChangeText={setAddress}
            placeholder={t('input_address.address_placeholder')}
            testID="input-address"
            // value={address}
          />
          <TextField
            iconName="ic_home"
            label=""
            showClear
            onChangeText={setDetailAddress}
            placeholder={t('input_address.detail_placeholder')}
            testID="input-detail"
            // value={detailAddress}
          />
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {suggestions?.map(item => (
            <AddressCard
              key={item.id}
              landAddress={item.landAddress}
              onPress={() => onSelectAddress(item)}
              postalCode={item.postalCode}
              roadAddress={item.roadAddress}
              selected={selectedAddress?.id === item.id}
              town={item.town}
            />
          ))}
          {!loading && !!address && suggestions?.length == 0 && (
            <EmptyView
              icon={imageNames.ic_map_gray}
              desc={t('common.no_data')}
              style={{
                marginTop: ScaleSize(50),
              }}
            />
          )}
          {!!loading && (
            <ActivityIndicator color={Colors.primary} size="large" />
          )}
        </ScrollView>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          title={t('input_address.confirm_button')}
          type="primary"
          onPress={onConfirm}
          disabled={!selectedAddress}
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
  footer: {
    borderTopColor: BORDER_COLOR,
    borderTopWidth: 1,
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(12),
  },
  previousAddress: {
    color: TEXT_MUTED,
    fontSize: ScaleSize(14),
    marginTop: ScaleSize(4),
    paddingHorizontal: ScaleSize(12),
  },
  scrollContent: {
    paddingBottom: ScaleSize(16),
  },
  section: {
    marginBottom: ScaleSize(2),
    paddingHorizontal: ScaleSize(16),
    paddingVertical: ScaleSize(16),
  },
  sectionTitle: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(15),
    fontWeight: '700',
    marginBottom: ScaleSize(8),
  },
});

export default InputAddress;
