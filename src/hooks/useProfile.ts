import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import {
  updateProfileInfoRequest,
  uploadAvatarRequest,
} from '@services/slices/account/accountSlice';
import { formatPhoneNumber } from '@utils/common';
import { ImagePicker } from '@utils/imagePicker';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useProfile() {
  const { t } = useTranslation();
  const profile = useAppSelector(AccountSelector.getProfile);
  const [fullName, setFullName] = useState(profile?.fullName ?? '');
  const [email, setEmail] = useState(profile?.email ?? '');
  const [phone, setPhone] = useState(
    (profile?.phone ?? '').replaceAll(/\D/g, ''),
  );

  const dispatch = useAppDispatch();

  const onChangePhone = useCallback((text: string) => {
    setPhone(text.replaceAll(/\D/g, ''));
  }, []);

  const onChangeAvatar = useCallback(() => {
    ImagePicker.showImagePicker((data: any) => {
      const uri = data?.sourceURL || data?.path;
      dispatch(
        uploadAvatarRequest({
          file: {
            name: ImagePicker.getFileName(uri),
            uri,
            type: data?.mime,
            size: data?.size,
          },
          // onSuccess: () => AppNavigator.showSnackBar({ message: ..., type: 'success' }),
          // onFailure: message => AppNavigator.showSnackBar({ message, type: 'failed' }),
        }),
      );
    });
  }, []);

  const onPressSave = useCallback(() => {
    dispatch(
      updateProfileInfoRequest({
        fullName,
        onSuccess: () =>
          AppNavigator.showSnackBar({
            message: t('profile.update_success'),
            type: 'success',
          }),
        onFailure: message =>
          AppNavigator.showSnackBar({ message, type: 'failed' }),
      }),
    );
  }, [dispatch, fullName, t]);

  const onPressChangePass = useCallback(() => {
    AppNavigator.navigate(Paths.UpdatePass);
  }, []);

  return {
    displayPhone: formatPhoneNumber(phone),
    email,
    fullName,
    avatar: profile?.avatar,
    membershipType: profile?.membershipType ?? '',
    onChangeAvatar,
    onChangeEmail: setEmail,
    onChangeFullName: setFullName,
    onChangePhone,
    onPressChangePass,
    onPressSave,
  };
}
