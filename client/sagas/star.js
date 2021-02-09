import { all, put, fork, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios'

import {
  ADD_STAR_REQUEST, ADD_STAR_SUCCESS, ADD_STAR_FAILURE,
  REMOVE_STAR_REQUEST, REMOVE_STAR_SUCCESS, REMOVE_STAR_FAILURE,
  LOAD_STARS_REQUEST, LOAD_STARS_SUCCESS, LOAD_STARS_FAILURE,
  ADD_STARRED, REMOVE_STARRED,
} from '../reducers/types'

function addStarAPI(data) {
  return axios.post('/star', data);
}

function* addStar(action) {
  try {
    const result = yield call(addStarAPI, action.data);
    yield put({
      type: ADD_STAR_SUCCESS,
      data: result.data
    })
    yield put({
      type: ADD_STARRED,
      data: result.data
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: ADD_STAR_FAILURE,
      error: error.response.data
    })
  }
}

function removeStarAPI(data) {
  return axios.patch('/star', data);
}

function* removeStar(action) {
  try {
    const result = yield call(removeStarAPI, action.data);
    yield put({
      type: REMOVE_STAR_SUCCESS,
      data: result.data
    })
    yield put({
      type: REMOVE_STARRED,
      data: result.data
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: REMOVE_STAR_FAILURE,
      error: error.response.data
    })
  }
}

function loadStarsAPI(data) {
  return axios.get('/star/stars', data);
}

function* loadStars(action) {
  try {
    const result = yield call(loadStarsAPI, action.data);
    yield put({
      type: LOAD_STARS_SUCCESS,
      data: result.data
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: LOAD_STARS_FAILURE,
      error: error.response.data
    })
  }
}

function* watchAddStar() {
  yield takeLatest(ADD_STAR_REQUEST, addStar)
}

function* watchRemoveStar() {
  yield takeLatest(REMOVE_STAR_REQUEST, removeStar)
}

function* watchLoadStars() {
  yield takeLatest(LOAD_STARS_REQUEST, loadStars)
}


export default function* starSaga() {
  yield all([
    fork(watchAddStar),
    fork(watchRemoveStar),
    fork(watchLoadStars),
  ])
}