import { all, fork } from 'redux-saga/effects';

import { accountSaga } from '@services/slices/account/accountSaga';
import { appSaga } from '@services/slices/app/appSaga';
import { authSaga } from '@services/slices/auth/authSaga';
import { notificationsSaga } from '@services/slices/notifications/notificationsSaga';
import { productsSaga } from '@services/slices/products/productsSaga';
import { surveySaga } from '@services/slices/survey/surveySaga';

export function* rootSaga() {
  yield all([
    fork(appSaga),
    fork(authSaga),
    fork(accountSaga),
    fork(notificationsSaga),
    fork(productsSaga),
    fork(surveySaga),
  ]);
}