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

function RegisterMembership(props) {
  const { step, onPressTopup, onBack, membershipOptions, ...rest } =
    useRegisterMembership(props);

  const DetailComponent = useMemo(() => {
    const screens: Record<RegisterMembershipStep, ComponentType<any>> = {
      choose_membership: ChooseMemberShipType,
      academic_verification_completed: AcademicVerifyCompleted,
      input_academic_email: InputAcademicEmail,
      academic_verification: AcademicVerification,
      choose_school: SchoolSelection,
      register_completed: RegisterCompleted,
    };
    return screens[step] || View;
  }, [step]);

  return (
    <DetailComponent
      {...rest}
      topHeader={0}
      onBack={onBack}
      options={membershipOptions}
      onPressSecondary={onPressTopup}
    />
  );
}
export default RegisterMembership;
