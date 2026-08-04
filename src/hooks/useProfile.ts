import AppNavigator from '@navigation/AppNavigator';
import { Paths } from '@navigation/paths';
import { useAppDispatch, useAppSelector } from '@services/common/storeHooks';
import { AccountSelector } from '@services/selectors';
import {
  getProfileRequest,
  updateProfileInfoRequest,
  uploadAvatarRequest,
} from '@services/slices/account/accountSlice';
import { formatPhoneNumber } from '@utils/common';
import { ImagePicker } from '@utils/imagePicker';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useProfile() {
  const { t } = useTranslation();
  const profile = useAppSelector(AccountSelector.getProfile);
  const [fullName, setFullName] = useState(profile?.fullName ?? '');
  const [email, setEmail] = useState(profile?.email ?? '');
  const [phone, setPhone] = useState(
    (profile?.phone ?? '').replaceAll(/\D/g, ''),
  );
  const [errors, setErrors] = useState<{ fullName?: string }>({});

  const dispatch = useAppDispatch();

  const onChangePhone = useCallback((text: string) => {
    setPhone(text.replaceAll(/\D/g, ''));
  }, []);

  const onChangeFullName = useCallback(
    (text: string) => {
      setFullName(text);
      const fullNameError =
        text.trim().length === 0 ? t('profile.error_name_required') : undefined;
      setErrors(prev =>
        prev.fullName === fullNameError ? prev : { fullName: fullNameError },
      );
    },
    [t],
  );

  const onChangeAvatar = useCallback(() => {
    ImagePicker.showImagePicker((isSuccess: boolean, data: any) => {
      if (!isSuccess) {
        AppNavigator.showSnackBar({
          message: t(data),
          type: 'failed',
        });
        return;
      }
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

  useEffect(() => {
    dispatch(getProfileRequest());
  }, []);

  const onPressSave = useCallback(() => {
    const isInValid = Object.values(errors || {})?.some(it => !!it);
    if (isInValid) {
      return;
    }
    setErrors({});
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
  }, [errors]);

  return {
    displayPhone: formatPhoneNumber(phone),
    email,
    errors,
    fullName,
    avatar: profile?.avatar,
    membershipType: profile?.membershipType ?? '',
    onChangeAvatar,
    onChangeEmail: setEmail,
    onChangeFullName,
    onChangePhone,
    onPressChangePass,
    onPressSave,
  };
}
