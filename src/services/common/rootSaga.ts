import { all, fork } from 'redux-saga/effects';

import { accountSaga } from '@services/slices/account/accountSaga';
import { appSaga } from '@services/slices/app/appSaga';
import { authSaga } from '@services/slices/auth/authSaga';
export function* rootSaga() {
  yield all([fork(appSaga), fork(authSaga), fork(accountSaga)]);
}
