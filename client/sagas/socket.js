import { all, fork, takeLatest } from 'redux-saga/effects';
import {
  SOCKET_CONNECT, SOCKET_DISCONNECT
} from '../reducers/types'
import { initiateSocket, disconnectSocket, detectError } from '../util/socket';

function* socketConnect() {
  yield initiateSocket();
  yield detectError();
}

function* socketDisconnect() {
  yield disconnectSocket();
}

function* watchSocketConnect() {
  yield takeLatest(SOCKET_CONNECT, socketConnect)
}

function* watchSocketDisconnect() {
  yield takeLatest(SOCKET_DISCONNECT, socketDisconnect)
}


export default function* socketSaga() {
  yield all([
    fork(watchSocketConnect),
    fork(watchSocketDisconnect),
  ])
}
