import LogoutButton from './LogoutButton';
import MenuSection from './MenuSection';
import ProfileHeader from './ProfileHeader';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useProfile } from '@hooks';

/** Màn Cá nhân: danh tính, dải liên hệ, hai nhóm menu và nút đăng xuất. */
function Profile() {
  const {
    employee,
    languageLabel,
    menuValues,
    onLogout,
    onPickLanguage,
    onPressItem,
    sections,
  } = useProfile();

  return (
    <View style={styles.container} testID="ProfileScreen">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header cuộn cùng nội dung: nó là danh tính chứ không phải thanh
            điều hướng, ghim lại chỉ tốn chỗ khi người dùng xem menu bên dưới. */}
        <ProfileHeader
          employee={employee}
          languageLabel={languageLabel}
          onPressLanguage={onPickLanguage}
        />

        <View style={styles.body}>
          {sections.map(section => (
            <MenuSection
              key={section.id}
              onPressItem={onPressItem}
              section={section}
              values={menuValues}
            />
          ))}

          <LogoutButton onLogout={onLogout} />
        </View>
      </ScrollView>
    </View>
  );
}

export default Profile;

const styles = StyleSheet.create({
  body: {
    gap: ScaleSize(22),
    padding: ScaleSize(16),
  },
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  content: {
    backgroundColor: Colors.gray28,
    paddingBottom: ScaleSize(28),
  },
});
