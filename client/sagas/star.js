import { all, put, fork, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios'

import {
  ADD_STAR_REQUEST, ADD_STAR_SUCCESS, ADD_STAR_FAILURE,
} from '../reducers/types'

function addStarAPI(data) {
  return axios.post('/star', data);
}

function* addStar(action) {
  try {
    const result = yield call(addStarAPI, action.data);
    yield put({
      type: ADD_STAR_SUCCESS,
      data: {
        star: result.data
      }
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: ADD_STAR_FAILURE,
      error: error
    })
  }
}

function* watchAddStar() {
  yield takeLatest(ADD_STAR_REQUEST, addStar)
}


export default function* starSaga() {
  yield all([
    fork(watchAddStar),
  ])
}