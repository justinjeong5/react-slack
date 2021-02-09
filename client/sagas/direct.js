import { all, put, fork, call, takeLatest } from 'redux-saga/effects';
import axios from "axios";

import {
  LOAD_DIRECT_CANDIDATE_REQUEST, LOAD_DIRECT_CANDIDATE_SUCCESS, LOAD_DIRECT_CANDIDATE_FAILURE,
  LOAD_DIRECTS_REQUEST, LOAD_DIRECTS_SUCCESS, LOAD_DIRECTS_FAILURE,
  CREATE_DIRECT_SUBSCRIBE, CREATE_DIRECT_SUCCESS, CREATE_DIRECT_FAILURE,
} from '../reducers/types'

function loadDirectCandidateAPI() {
  return axios.get('/user/users')
}

function* loadDirectCandidate() {
  try {
    const result = yield call(loadDirectCandidateAPI)
    yield put({
      type: LOAD_DIRECT_CANDIDATE_SUCCESS,
      data: {
        directs: result.data.users
      }
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: LOAD_DIRECT_CANDIDATE_FAILURE,
      error: error.response.data
    })
  }
}

function loadDirectsAPI() {
  return axios.get('/direct/directs')
}

function* loadDirects() {
  try {
    const result = yield call(loadDirectsAPI)
    yield put({
      type: LOAD_DIRECTS_SUCCESS,
      data: result.data
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: LOAD_DIRECTS_FAILURE,
      error: error.response.data
    })
  }
}

function* addDirect(action) {
  if (!action.error) {
    yield put({
      type: CREATE_DIRECT_SUCCESS,
      data: action.data
    })
  } else {
    console.error(action.error)
    yield put({
      type: CREATE_DIRECT_FAILURE,
      error: action.error
    })
  }
}

function* watchLoadDirectCandidate() {
  yield takeLatest(LOAD_DIRECT_CANDIDATE_REQUEST, loadDirectCandidate)
}

function* watchLoadDirects() {
  yield takeLatest(LOAD_DIRECTS_REQUEST, loadDirects)
}

function* watchAddDirect() {
  yield takeLatest(CREATE_DIRECT_SUBSCRIBE, addDirect)
}


export default function* directSaga() {
  yield all([
    fork(watchLoadDirectCandidate),
    fork(watchLoadDirects),
    fork(watchAddDirect),
  ])
}