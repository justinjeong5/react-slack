import { all, fork } from 'redux-saga/effects'
import axios from 'axios'
import dotenv from 'dotenv'

import userSaga from './user'
import roomSaga from './room'
import chatSaga from './chat'
import imageSaga from './image'
import usersSaga from './users'
import starSaga from './star'

dotenv.config();
axios.defaults.baseURL = process.env.SERVER_URL;

export default function* rootSaga() {
  yield all([
    fork(userSaga),
    fork(roomSaga),
    fork(chatSaga),
    fork(imageSaga),
    fork(usersSaga),
    fork(starSaga),
  ])
}