import { all, fork } from 'redux-saga/effects'
import axios from 'axios'

import userSaga from './user'
import roomSaga from './room'
import directSaga from './direct'
import chatSaga from './chat'
import imageSaga from './image'
import starSaga from './star'
import socketSaga from './socket'
import presenceSaga from './presence'

import config from '../config/config';
const env = process.env.NODE_ENV || 'development';
const { SERVER_URL } = config[env];

axios.defaults.withCredentials = true;
axios.defaults.baseURL = SERVER_URL;

export default function* rootSaga() {
  yield all([
    fork(userSaga),
    fork(roomSaga),
    fork(directSaga),
    fork(chatSaga),
    fork(imageSaga),
    fork(starSaga),
    fork(socketSaga),
    fork(presenceSaga),
  ])
}