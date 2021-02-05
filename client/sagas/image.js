import { all, put, fork, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios'

import {
  UPLOAD_IMAGE_REQUEST, UPLOAD_IMAGE_SUCCESS, UPLOAD_IMAGE_FAILURE,
  CHANGE_USER_IMAGE,
} from '../reducers/types'

function uploadImageAPI(data) {
  return axios.post('/image', data);
}

function* uploadImage(action) {
  try {
    yield call(uploadImageAPI, action.data)
    yield put({
      type: UPLOAD_IMAGE_SUCCESS,
      data: { image: url }
    })
    yield put({
      type: CHANGE_USER_IMAGE,
      data: { image: url }
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: UPLOAD_IMAGE_FAILURE,
      error: error
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