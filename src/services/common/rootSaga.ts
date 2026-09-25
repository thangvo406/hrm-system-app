import { all, fork } from 'redux-saga/effects';

import { accountSaga } from '@services/slices/account/accountSaga';
import { appSaga } from '@services/slices/app/appSaga';
import { attendanceSaga } from '@services/slices/attendance/attendanceSaga';
import { authSaga } from '@services/slices/auth/authSaga';
import { homeSaga } from '@services/slices/home/homeSaga';
export function* rootSaga() {
  yield all([
    fork(appSaga),
    fork(authSaga),
    fork(accountSaga),
    fork(attendanceSaga),
    fork(homeSaga),
  ]);
}
