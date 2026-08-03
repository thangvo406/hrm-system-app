import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  AppButton,
  Button,
  HeaderDetail,
  Image,
  ProgressiveImage,
  TextField,
} from '@components';
import { ScaleSize } from '@kits/core';
import { Colors } from '@constants';
import { useProfile } from '@hooks';
import { NOOP } from '@utils/common';

const AVATAR_SIZE = ScaleSize(72 + 25);
const AVATAR_ICON_SIZE = ScaleSize(48);
const BORDER_RADIUS = ScaleSize(10);
const LABEL_COLOR = '#5C5C5C';
const TEXT_COLOR = '#1A1A1A';

function Profile() {
  const { t } = useTranslation();
  const {
    displayPhone,
    email,
    fullName,
    avatar,
    errors,
    membershipType,
    onChangeAvatar,
    onChangeEmail,
    onChangeFullName,
    onChangePhone,
    onPressChangePass,
    onPressSave,
  } = useProfile();

  const [isAvatarError, setAvatarError] = useState(false);
  useEffect(() => {
    setAvatarError(false);
  }, [avatar?.fileUrl]);

  return (
    <View style={styles.container}>
      <HeaderDetail hideBtnBack title={t('profile.title')} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <AppButton onPress={onChangeAvatar} style={styles.avatarCircle}>
            {!isAvatarError && avatar?.fileUrl ? (
              <ProgressiveImage
                height={AVATAR_SIZE}
                onError={() => {
                  setAvatarError(true);
                }}
                resizeMode="cover"
                imageStyle={styles.avatarImage}
                containerStyle={styles.avatarImage}
                url={avatar?.fileUrl}
                width={AVATAR_SIZE}
              />
            ) : (
              <Image
                color={Colors.primary}
                height={AVATAR_ICON_SIZE}
                name="user"
                type="svg"
                width={AVATAR_ICON_SIZE}
              />
            )}
          </AppButton>
          <Text style={styles.avatarLabel}>{t('profile.change_photo')}</Text>
        </View>

        {/* Basic info section */}
        <Text style={styles.sectionTitle}>{t('profile.section_basic')}</Text>

        <View style={styles.card}>
          <TextField
            iconName="user"
            label={t('profile.field_name')}
            error={errors.fullName}
            editable={false}
            onChangeText={onChangeFullName}
            placeholder={t('profile.placeholder_name')}
            value={fullName}
          />
          <TextField
            iconName="email"
            editable={false}
            keyboardType="email-address"
            label={t('profile.field_email')}
            onChangeText={onChangeEmail}
            placeholder={t('profile.placeholder_email')}
            value={email}
          />
          <TextField
            editable={false}
            iconName="ic_phone"
            keyboardType="phone-pad"
            label={t('profile.field_phone')}
            onChangeText={onChangePhone}
            placeholder={t('profile.placeholder_phone')}
            value={displayPhone}
          />
          <TextField
            editable={false}
            iconName="ic_id_card"
            label={t('profile.field_member_type')}
            onChangeText={NOOP}
            placeholder=""
            value={membershipType}
          />
        </View>

        {/* Save button */}
        <View style={styles.footer}>
          <Button
            title={t('profile.save')}
            type="rounded"
            onPress={onPressSave}
          />
          <Button
            title={t('profile.change_pass')}
            type="rounded"
            style={{
              marginTop: ScaleSize(12),
            }}
            onPress={onPressChangePass}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default React.memo(Profile);

const styles = StyleSheet.create({
  avatarCircle: {
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: AVATAR_SIZE / 2,
    height: AVATAR_SIZE,
    justifyContent: 'center',
    width: AVATAR_SIZE,
  },
  avatarImage: {
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarLabel: {
    color: LABEL_COLOR,
    fontSize: ScaleSize(14),
    marginTop: ScaleSize(8),
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: ScaleSize(24),
    marginTop: ScaleSize(16),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS,
    gap: ScaleSize(4),
    overflow: 'hidden',
    paddingHorizontal: ScaleSize(8),
    paddingVertical: ScaleSize(8),
  },
  container: {
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
  footer: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSize(12),
    marginBottom: ScaleSize(30),
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: ScaleSize(12),
    height: ScaleSize(52),
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: ScaleSize(16),
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: ScaleSize(16),
    paddingHorizontal: ScaleSize(20),
  },
  sectionTitle: {
    color: TEXT_COLOR,
    fontSize: ScaleSize(15),
    fontWeight: '700',
    marginBottom: ScaleSize(8),
  },
});
