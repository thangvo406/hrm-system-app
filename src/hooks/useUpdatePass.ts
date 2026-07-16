import AppNavigator from '@navigation/AppNavigator';
import { useAppDispatch } from '@services/common/storeHooks';
import { updatePasswordRequest } from '@services/slices/account/accountSlice';
import { CommonUtils } from '@utils';
import { validatePassword } from '@utils/common';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type UpdatePassValues = {
  confirmPassword: string;
  currentPassword: string;
  newPassword: string;
};

type UpdatePassErrors = {
  confirmPassword?: string;
  currentPassword?: string;
  newPassword?: string;
};

type TouchedState = {
  confirmPassword?: boolean;
  currentPassword?: boolean;
  newPassword?: boolean;
};

const onBack = () => {
  AppNavigator.goBack();
};

const validateUpdatePass = (
  values: UpdatePassValues,
  t: (key: string) => string,
): UpdatePassErrors => {
  const errors: UpdatePassErrors = {};
  if (values.currentPassword.length === 0) {
    errors.currentPassword = t('update_pass.error_current_required');
  }
  if (values.newPassword.length === 0) {
    errors.newPassword = t('authorisation.error_password_required');
  } else if (!validatePassword(values.newPassword)) {
    errors.newPassword = t('authorisation.pass_invalid');
  }
  if (values.confirmPassword.length === 0) {
    errors.confirmPassword = t('update_pass.error_confirm_required');
  } else if (values.confirmPassword !== values.newPassword) {
    errors.confirmPassword = t('update_pass.error_password_mismatch');
  }
  return errors;
};

export function useUpdatePass() {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState<TouchedState>({});
  const dispatch = useAppDispatch();

  const { valid, visible } = CommonUtils.computeFormAuthErrors(
    { confirmPassword, currentPassword, newPassword },
    touched,
    validateUpdatePass,
    t,
  );

  const onChangeCurrentPassword = (value: string) => {
    setCurrentPassword(value);
    setTouched(previous => ({ ...previous, currentPassword: true }));
  };

  const onChangeNewPassword = (value: string) => {
    setNewPassword(value);
    setTouched(previous => ({ ...previous, newPassword: true }));
  };

  const onChangeConfirmPassword = (value: string) => {
    setConfirmPassword(value);
    setTouched(previous => ({ ...previous, confirmPassword: true }));
  };

  const onSubmit = () => {
    setTouched({
      confirmPassword: true,
      currentPassword: true,
      newPassword: true,
    });
    if (!valid) return;
    dispatch(
      updatePasswordRequest({
        currentPassword,
        newPassword,
        onSuccess: () => {
          AppNavigator.showSnackBar({
            message: t('update_pass.success'),
            type: 'success',
          });
          AppNavigator.goBack();
        },
        onFailure: message =>
          AppNavigator.showSnackBar({ message, type: 'failed' }),
      }),
    );
  };

  return {
    confirmPassword,
    currentPassword,
    errors: visible,
    newPassword,
    onBack,
    onChangeConfirmPassword,
    onChangeCurrentPassword,
    onChangeNewPassword,
    onSubmit,
    valid,
  };
}
