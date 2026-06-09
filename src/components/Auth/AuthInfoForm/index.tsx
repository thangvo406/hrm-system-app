import InputInfo, {
  type InputInfoValues,
} from '@screens/Authorisation/components/RegisterFlow/InputInfo';
import React from 'react';

type AuthInfoFormProps = {
  readonly onSubmit: (values: InputInfoValues) => void;
};

function AuthInfoForm({ onSubmit }: AuthInfoFormProps) {
  return <InputInfo onSubmit={onSubmit} />;
}

export default React.memo(AuthInfoForm);
