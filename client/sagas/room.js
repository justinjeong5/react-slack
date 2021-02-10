import { all, put, fork, call, takeLatest } from 'redux-saga/effects';
import axios from "axios";

import {
  LOAD_ROOMS_REQUEST, LOAD_ROOMS_SUCCESS, LOAD_ROOMS_FAILURE,
  CREATE_ROOM_SUBSCRIBE, CREATE_ROOM_SUCCESS, CREATE_ROOM_FAILURE,
  TYPING_START_SUBSCRIBE, TYPING_START_SUCCESS, TYPING_START_FAILURE,
  TYPING_FINISH_SUBSCRIBE, TYPING_FINISH_SUCCESS, TYPING_FINISH_FAILURE,
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

function* typingStart(action) {
  if (!action.error) {
    yield put({
      type: TYPING_START_SUCCESS,
      data: action.data
    })
  } else {
    console.error(action.error);
    yield put({
      type: TYPING_START_FAILURE,
      error: action.error
    })
  }
}

function* typingFinish(action) {
  if (!action.error) {
    yield put({
      type: TYPING_FINISH_SUCCESS,
      data: action.data
    })
  } else {
    console.error(action.error);
    yield put({
      type: TYPING_FINISH_FAILURE,
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

function* watchTypingStart() {
  yield takeLatest(TYPING_START_SUBSCRIBE, typingStart)
}

function* watchTypingFinish() {
  yield takeLatest(TYPING_FINISH_SUBSCRIBE, typingFinish)
}


export default function* roomSaga() {
  yield all([
    fork(watchLoadRooms),
    fork(watchCreateRoom),
    fork(watchTypingStart),
    fork(watchTypingFinish),
  ])
}