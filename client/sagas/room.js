import { all, put, fork, call, takeLatest } from 'redux-saga/effects';
import axios from "axios";

import {
  LOAD_ROOMS_REQUEST, LOAD_ROOMS_SUCCESS, LOAD_ROOMS_FAILURE,
  CREATE_ROOM_REQUEST, CREATE_ROOM_SUCCESS, CREATE_ROOM_FAILURE,
} from '../reducers/types'

function loadRoomsAPI() {
  return axios.get('/room/rooms')
}

function* loadRooms() {
  try {
    const result = yield call(loadRoomsAPI)
    yield put({
      type: LOAD_ROOMS_SUCCESS,
      data: {
        rooms: result.data
      }
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: LOAD_ROOMS_FAILURE,
      error: error
    })
  }
}

function createRoomAPI(data) {
  return axios.post('/room', data)
}

function* createRoom(action) {
  try {
    const result = yield call(createRoomAPI, action.data)
    yield put({
      type: CREATE_ROOM_SUCCESS,
      data: {
        room: result.data
      }
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: CREATE_ROOM_FAILURE,
      error: error
    })
  }
}

function* watchLoadRooms() {
  yield takeLatest(LOAD_ROOMS_REQUEST, loadRooms)
}

function* watchCreateRoom() {
  yield takeLatest(CREATE_ROOM_REQUEST, createRoom)
}


export default function* roomSaga() {
  yield all([
    fork(watchLoadRooms),
    fork(watchCreateRoom),
  ])
}