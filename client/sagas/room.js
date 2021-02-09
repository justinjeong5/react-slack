import { all, put, fork, call, takeLatest } from 'redux-saga/effects';
import axios from "axios";

import {
  LOAD_ROOMS_REQUEST, LOAD_ROOMS_SUCCESS, LOAD_ROOMS_FAILURE,
  CREATE_ROOM_SUBSCRIBE, CREATE_ROOM_SUCCESS, CREATE_ROOM_FAILURE,
} from '../reducers/types'

function loadRoomsAPI() {
  return axios.get('/room/rooms')
}

function* loadRooms() {
  try {
    const result = yield call(loadRoomsAPI)
    yield put({
      type: LOAD_ROOMS_SUCCESS,
      data: result.data
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: LOAD_ROOMS_FAILURE,
      error: error.response.data
    })
  }
}

function* createRoom(action) {
  if (!action.error) {
    yield put({
      type: CREATE_ROOM_SUCCESS,
      data: action.data
    })
  } else {
    console.error(action.error)
    yield put({
      type: CREATE_ROOM_FAILURE,
      error: action.error
    })
  }
}

function* watchLoadRooms() {
  yield takeLatest(LOAD_ROOMS_REQUEST, loadRooms)
}

function* watchCreateRoom() {
  yield takeLatest(CREATE_ROOM_SUBSCRIBE, createRoom)
}


export default function* roomSaga() {
  yield all([
    fork(watchLoadRooms),
    fork(watchCreateRoom),
  ])
}