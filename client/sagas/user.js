import { all, put, fork, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import md5 from 'md5'

import {
  REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS, REGISTER_USER_FAILURE,
  LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE,
  LOGOUT_USER_REQUEST, LOGOUT_USER_SUCCESS, LOGOUT_USER_FAILURE,
} from '../reducers/types'

function registerAPI(data) {
  return axios.post('/user', data)
}

function* register(action) {
  try {
    const data = {
      ...action.data,
      image: `https://gravatar.com/avatar/${md5(action.data.email)}?d=identicon`
    }
    const result = yield call(registerAPI, data);
    yield put({
      type: REGISTER_USER_SUCCESS,
      data: {
        user: result.data
      }
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: REGISTER_USER_FAILURE,
      error: error
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
      data: {
        user: result.data
      }
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: LOGIN_USER_FAILURE,
      error: error
    })
  }
}

function logoutAPI() {
  return axios.get('/user/logout')
}

function* logout() {
  try {
    yield call(logoutAPI);
    yield put({
      type: LOGOUT_USER_SUCCESS,
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: LOGOUT_USER_FAILURE,
      error: error
    })
  }
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


export default function* userSaga() {
  yield all([
    fork(watchRegister),
    fork(watchLogin),
    fork(watchLogout),
  ])
}