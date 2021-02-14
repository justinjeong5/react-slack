import { all, put, fork, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import md5 from 'md5'

import {
  AUTH_USER_REQUEST, AUTH_USER_SUCCESS, AUTH_USER_FAILURE,
  REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS, REGISTER_USER_FAILURE,
  LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE,
  LOGOUT_USER_REQUEST, LOGOUT_USER_SUCCESS, LOGOUT_USER_FAILURE,
  SET_USER_IMAGE_REQUEST, SET_USER_IMAGE_SUCCESS, SET_USER_IMAGE_FAILURE,
} from '../reducers/types'

function authAPI() {
  return axios.get('/user/auth')
}

function* auth() {
  try {
    const result = yield call(authAPI);
    yield put({
      type: AUTH_USER_SUCCESS,
      data: result.data
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: AUTH_USER_FAILURE,
      error: error.response.data
    })
  }
}

function registerAPI(data) {
  return axios.post('/user/register', data)
}

function* register(action) {
  try {
    const data = {
      ...action.data,
      image: `https://gravatar.com/avatar/${md5(action.data.email)}?d=identicon`
    }
    yield call(registerAPI, data);
    const loginResult = yield call(loginAPI, data);
    yield put({
      type: REGISTER_USER_SUCCESS,
      data: loginResult.data
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: REGISTER_USER_FAILURE,
      error: error.response.data
    })
  }
}

function loginAPI(data) {
  return axios.post('/user/login', data)
}

function* login(action) {
  try {
    const result = yield call(loginAPI, action.data);
    yield put({
      type: LOGIN_USER_SUCCESS,
      data: result.data
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: LOGIN_USER_FAILURE,
      error: error.response.data
    })
  }
}

function logoutAPI(data) {
  return axios.patch('/user/logout', data)
}

function* logout(action) {
  try {
    yield call(logoutAPI, action.data);
    yield put({
      type: LOGOUT_USER_SUCCESS,
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: LOGOUT_USER_FAILURE,
      error: error.response.data
    })
  }
}

function setImageAPI(data) {
  return axios.post('/user/image', data)
}

function* setImage(action) {
  try {
    const result = yield call(setImageAPI, action.data);
    yield put({
      type: SET_USER_IMAGE_SUCCESS,
      data: result.data
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: SET_USER_IMAGE_FAILURE,
      error: error.response.data
    })
  }
}

function* watchAuth() {
  yield takeLatest(AUTH_USER_REQUEST, auth)
}

function* watchRegister() {
  yield takeLatest(REGISTER_USER_REQUEST, register)
}

function* watchLogin() {
  yield takeLatest(LOGIN_USER_REQUEST, login)
}

function* watchLogout() {
  yield takeLatest(LOGOUT_USER_REQUEST, logout)
}

function* watchSetImage() {
  yield takeLatest(SET_USER_IMAGE_REQUEST, setImage)
}


export default function* userSaga() {
  yield all([
    fork(watchAuth),
    fork(watchRegister),
    fork(watchLogin),
    fork(watchLogout),
    fork(watchSetImage),
  ])
}