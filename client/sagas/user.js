import { all, put, fork, call, takeLatest } from "redux-saga/effects";
import firebase from '../firebase/config'
import md5 from 'md5'

import {
  REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS, REGISTER_USER_FAILURE,
  LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE,
} from '../reducers/types'

function firebaseCreateUserAPI(data) {
  return firebase.auth().createUserWithEmailAndPassword(data.email, data.password);
}

function firebaseUpdateProfileAPI(auth, data) {
  return auth.user.updateProfile({
    displayName: data.nickname,
    photoURL: `https://gravatar.com/avatar/${md5(data.email)}?d=identicon`
  });
}

function firebaseDatabaseAPI(auth) {
  return firebase.database().ref('users').child(auth.user.uid).set({
    name: auth.user.displayName,
    image: auth.user.photoURL
  })
}

function* register(action) {
  try {
    const auth = yield call(firebaseCreateUserAPI, action.data);
    yield call(firebaseUpdateProfileAPI, auth, action.data);
    yield call(firebaseDatabaseAPI, auth)
    const result = yield call(firebaseSignInAPI, action.data);
    yield put({
      type: REGISTER_USER_SUCCESS,
      data: {
        user: {
          uid: result.user.uid,
          email: result.user.email,
          nickname: result.user.displayName,
          image: result.user.photoURL,
        }
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

function firebaseSignInAPI(data) {
  return firebase.auth().signInWithEmailAndPassword(data.email, data.password);
}

function* login(action) {
  try {
    const result = yield call(firebaseSignInAPI, action.data);
    yield put({
      type: LOGIN_USER_SUCCESS,
      data: {
        user: {
          uid: result.user.uid,
          email: result.user.email,
          nickname: result.user.displayName,
          image: result.user.photoURL,
        }
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

function* watchRegister() {
  yield takeLatest(REGISTER_USER_REQUEST, register)
}

function* watchLogin() {
  yield takeLatest(LOGIN_USER_REQUEST, login)
}


export default function* userSaga() {
  yield all([
    fork(watchRegister),
    fork(watchLogin),
  ])
}