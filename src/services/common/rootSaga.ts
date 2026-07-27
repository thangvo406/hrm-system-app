import { all, fork } from 'redux-saga/effects';

import { accountSaga } from '@services/slices/account/accountSaga';
import { accountManagementSaga } from '@services/slices/accountManagement/accountManagementSaga';
import { appSaga } from '@services/slices/app/appSaga';
import { authSaga } from '@services/slices/auth/authSaga';
import { notificationsSaga } from '@services/slices/notifications/notificationsSaga';
import { paymentSaga } from '@services/slices/payment/paymentSaga';
import { productsSaga } from '@services/slices/products/productsSaga';
import { storesSaga } from '@services/slices/stores/storesSaga';
import { surveySaga } from '@services/slices/survey/surveySaga';
export function* rootSaga() {
  yield all([
    fork(appSaga),
    fork(authSaga),
    fork(accountSaga),
    fork(accountManagementSaga),
    fork(notificationsSaga),
    fork(paymentSaga),
    fork(productsSaga),
    fork(storesSaga),
    fork(surveySaga),
  ]);
}
