import InputInfo from '@screens/Authorisation/components/RegisterFlow/InputInfo';
import React from 'react';

function AuthInfoForm(props: any) {
  return <InputInfo {...props} />;
}

export default React.memo(AuthInfoForm);
