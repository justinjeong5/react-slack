import { all, put, fork, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios'
import {
  LOAD_PRESENCES_REQUEST, LOAD_PRESENCES_SUCCESS, LOAD_PRESENCES_FAILURE,
  PRESENCE_USER_SUBSCRIBE, PRESENCE_USER_SUCCESS, PRESENCE_USER_FAILURE,
  ABSENCE_USER_SUBSCRIBE, ABSENCE_USER_SUCCESS, ABSENCE_USER_FAILURE,
} from '../reducers/types'

function loadPresencesAPI(data) {
  return axios.get('/user/users', data)
}

function* loadPresences(action) {
  try {
    const result = yield call(loadPresencesAPI, action.data);
    yield put({
      type: LOAD_PRESENCES_SUCCESS,
      data: result.data
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: LOAD_PRESENCES_FAILURE,
      error: error.response.data
    })
  }
}

function* presenceUser(action) {
  if (!action.error) {
    yield put({
      type: PRESENCE_USER_SUCCESS,
      data: action.data
    })
  } else {
    console.error(action.error)
    yield put({
      type: PRESENCE_USER_FAILURE,
      error: action.error
    })
  }
}

function* absenceUser(action) {
  if (!action.error) {
    yield put({
      type: ABSENCE_USER_SUCCESS,
      data: action.data
    })
  } else {
    console.error(action.error)
    yield put({
      type: ABSENCE_USER_FAILURE,
      error: action.error
    })
  }
}

function* watchLoadPresences() {
  yield takeLatest(LOAD_PRESENCES_REQUEST, loadPresences)
}

function* watchPresenceUser() {
  yield takeLatest(PRESENCE_USER_SUBSCRIBE, presenceUser)
}

function* watchAbsenceUser() {
  yield takeLatest(ABSENCE_USER_SUBSCRIBE, absenceUser)
}


export default function* chatSaga() {
  yield all([
    fork(watchLoadPresences),
    fork(watchPresenceUser),
    fork(watchAbsenceUser),
  ])
}