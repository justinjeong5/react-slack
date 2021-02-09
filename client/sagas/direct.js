import { all, put, fork, call, takeLatest } from 'redux-saga/effects';
import axios from "axios";

import {
  LOAD_DIRECT_CANDIDATE_REQUEST, LOAD_DIRECT_CANDIDATE_SUCCESS, LOAD_DIRECT_CANDIDATE_FAILURE,
  LOAD_DIRECTS_REQUEST, LOAD_DIRECTS_SUCCESS, LOAD_DIRECTS_FAILURE,
  ADD_DIRECT_REQUEST, ADD_DIRECT_SUCCESS, ADD_DIRECT_FAILURE,
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

function addDirectAPI(data) {
  return axios.post('/direct', data)
}

function* addDirect(action) {
  try {
    const result = yield call(addDirectAPI, action.data)
    yield put({
      type: ADD_DIRECT_SUCCESS,
      data: result.data
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: ADD_DIRECT_FAILURE,
      error: error.response.data
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
  yield takeLatest(ADD_DIRECT_REQUEST, addDirect)
}


export default function* directSaga() {
  yield all([
    fork(watchLoadDirectCandidate),
    fork(watchLoadDirects),
    fork(watchAddDirect),
  ])
}