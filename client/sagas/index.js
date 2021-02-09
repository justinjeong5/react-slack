import { all, fork } from 'redux-saga/effects'
import axios from 'axios'

import userSaga from './user'
import roomSaga from './room'
import directSaga from './direct'
import chatSaga from './chat'
import imageSaga from './image'
import starSaga from './star'

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:3065';

export default function* rootSaga() {
  yield all([
    fork(userSaga),
    fork(roomSaga),
    fork(directSaga),
    fork(chatSaga),
    fork(imageSaga),
    fork(starSaga),
  ])
}