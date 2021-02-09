import { all, put, fork, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios'

import {
  UPLOAD_IMAGE_REQUEST, UPLOAD_IMAGE_SUCCESS, UPLOAD_IMAGE_FAILURE,
} from '../reducers/types'

function uploadImageAPI(data) {
  return axios.post('/image', data);
}

function* uploadImage(action) {
  try {
    const result = yield call(uploadImageAPI, action.data)
    yield put({
      type: UPLOAD_IMAGE_SUCCESS,
      data: result.data
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: UPLOAD_IMAGE_FAILURE,
      error: error.response.data
    })
  }
}

function* watchUploadImage() {
  yield takeLatest(UPLOAD_IMAGE_REQUEST, uploadImage)
}


export default function* imageSaga() {
  yield all([
    fork(watchUploadImage),
  ])
}