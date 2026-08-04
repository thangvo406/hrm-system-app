import { useRegisterMembership } from '@hooks';
import RegisterCompleted from '@screens/Authorisation/components/RegisterFlow/RegisterCompleted';
import ChooseMemberShipType from '@screens/Authorisation/components/RegisterFlow/ChooseMemberShipType';
import AcademicVerifyCompleted from '@screens/Authorisation/components/RegisterFlow/AcademicVerifyCompleted';
import InputAcademicEmail from '@screens/Authorisation/components/RegisterFlow/InputAcademicEmail';
import AcademicVerification from '@screens/Authorisation/components/RegisterFlow/AcademicVerification';
import SchoolSelection from '@screens/SchoolSelection';
import { RegisterMembershipStep } from '@type';
import { ComponentType, useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import BankInformationView from '@screens/BankInformation/BankInformationView';

function RegisterMembership(props: any) {
  const {
    step,
    onBack,
    membershipOptions,
    dataInfoVerifyMembership,
    isShowContributeBtn,
    onPressContribute,
    ...rest
  } = useRegisterMembership(props);
  const { t } = useTranslation();

  const DetailComponent = useMemo(() => {
    const screens: Record<RegisterMembershipStep, ComponentType<any>> = {
      choose_membership: ChooseMemberShipType,
      academic_verification_completed: AcademicVerifyCompleted,
      input_academic_email: InputAcademicEmail,
      bank_information: BankInformationView,
      academic_verification: AcademicVerification,
      choose_school: SchoolSelection,
      register_completed: RegisterCompleted,
    };
    return screens[step] || View;
  }, [step]);

  return (
    <DetailComponent
      {...rest}
      titleBtnPrimary="register_completed.complete"
      titleBtnSecondary={
        isShowContributeBtn ? 'register_completed.contribution' : ''
      }
      btnSubmit={t('common.popup.btn_close')}
      desc={t('register_completed.desc')}
      dataVerifiedMembership={dataInfoVerifyMembership}
      onPressSecondary={onPressContribute}
      topHeader={0}
      onBack={onBack}
      options={membershipOptions}
    />
  );
}
export default RegisterMembership;
