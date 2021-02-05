import { all, put, fork, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios'

import {
  LOAD_USERS_REQUEST, LOAD_USERS_SUCCESS, LOAD_USERS_FAILURE,
} from '../reducers/types'

function loadUserAPI() {
  return axios.get('/users')
}

function loadUsers() {
  try {
    const result = yield call(loadUserAPI);
    yield put({
      type: LOAD_USERS_SUCCESS,
      data: {
        users: result.data
      }
    })
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_USERS_FAILURE,
      error: error.response.data
    })
  }
}

function* watchLoadUsers() {
  yield takeLatest(LOAD_USERS_REQUEST, loadUsers)
}

export default function* usersSaga() {
  yield all([
    fork(watchLoadUsers)
  ])
} 