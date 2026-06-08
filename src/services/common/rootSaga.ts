import { all, fork } from 'redux-saga/effects';

import { appSaga } from '@services/slices/app/appSaga';

export function* rootSaga() {
  yield all([fork(appSaga)]);
}
