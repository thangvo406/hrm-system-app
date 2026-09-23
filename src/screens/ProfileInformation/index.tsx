import AvatarCard from './AvatarCard';
import InfoSection from './InfoSection';
import ProfileInformationHeader from './ProfileInformationHeader';
import { Colors } from '@constants';
import { ScaleSize } from '@kits/core';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useProfileInformation } from '@hooks';

/** Màn Thông tin cá nhân: ảnh đại diện và các nhóm trường chỉ đọc. */
function ProfileInformation() {
  const { employee, onChangePhoto, onGoBack, sections } =
    useProfileInformation();

  return (
    <View style={styles.container} testID="ProfileInformationScreen">
      <ProfileInformationHeader onGoBack={onGoBack} />

      <View style={styles.sheet}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <AvatarCard
            fullName={employee.fullName}
            initials={employee.initials}
            jobTitle={employee.jobTitle}
            onChangePhoto={onChangePhoto}
          />

          {sections.map(section => (
            <InfoSection key={section.id} section={section} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

export default ProfileInformation;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.navy05,
    flex: 1,
  },
  content: {
    gap: ScaleSize(20),
    padding: ScaleSize(16),
    paddingBottom: ScaleSize(28),
  },
  // Tấm nền bo hai góc trên, trùm lên mép dưới dải navy đúng như thiết kế.
  sheet: {
    backgroundColor: Colors.gray28,
    borderTopLeftRadius: ScaleSize(22),
    borderTopRightRadius: ScaleSize(22),
    flex: 1,
    marginTop: -ScaleSize(16),
    overflow: 'hidden',
  },
});
