import type { RootScreenProps } from '@navigation/types';

import { useMemo } from 'react';
import Failed from './components/Failed';
import Success from './components/Success';
import { Paths } from '@navigation/paths';

function AcademicVerificationFinish({
  route,
}: RootScreenProps<Paths.AcademicVerificationFinish>) {
  const DetailScreen = useMemo(
    () => (route.params?.type === 'failed' ? Failed : Success),
    [route.params?.type],
  );
  return <DetailScreen {...(route.params || {})} />;
}

export default AcademicVerificationFinish;
