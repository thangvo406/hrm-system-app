import { all, fork } from 'redux-saga/effects';

import { accountSaga } from '@services/slices/account/accountSaga';
import { announcementsSaga } from '@services/slices/announcements/announcementsSaga';
import { appSaga } from '@services/slices/app/appSaga';
import { authSaga } from '@services/slices/auth/authSaga';
import { notificationsSaga } from '@services/slices/notifications/notificationsSaga';

export function* rootSaga() {
  yield all([
    fork(appSaga),
    fork(authSaga),
    fork(accountSaga),
    fork(announcementsSaga),
    fork(notificationsSaga),
  ]);
}
