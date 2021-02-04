import { all, put, fork, call, takeLatest } from "redux-saga/effects";
import firebase from '../firebase/config'
import md5 from 'md5'

import {
  REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS, REGISTER_USER_FAILURE,
  LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE,
  LOGOUT_USER_REQUEST, LOGOUT_USER_SUCCESS, LOGOUT_USER_FAILURE,
  CHANGE_IMAGE_REQUEST, CHANGE_IMAGE_SUCCESS, CHANGE_IMAGE_FAILURE,
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

function firebaseSignOutAPI() {
  return firebase.auth().signOut();
}

function* logout() {
  try {
    yield call(firebaseSignOutAPI);
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

function firebaseStorageAPI(data) {
  return firebase.storage().ref('user_image')
    .child(data.uid)
    .put(data.file, data.metadata);
}

function firebaseGetDownloadAPI(snapshot) {
  return snapshot.ref.getDownloadURL();
}

function firebaseUpdateImageAPI(url) {
  return firebase.auth().currentUser.updateProfile({
    photoURL: url,
  })
}

function firebaseUpdateDatabaseAPI(uid, url) {
  return firebase.database().ref('users')
    .child(uid)
    .update({ image: uid })
}

function* changeImage(action) {
  try {
    const snapshot = yield call(firebaseStorageAPI, action.data);
    const url = yield call(firebaseGetDownloadAPI, snapshot);
    yield call(firebaseUpdateImageAPI, url)
    yield call(firebaseUpdateDatabaseAPI, action.data.uid, url)
    yield put({
      type: CHANGE_IMAGE_SUCCESS,
      data: { image: url }
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: CHANGE_IMAGE_FAILURE,
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

function* watchChangeImage() {
  yield takeLatest(CHANGE_IMAGE_REQUEST, changeImage)
}


export default function* userSaga() {
  yield all([
    fork(watchRegister),
    fork(watchLogin),
    fork(watchLogout),
    fork(watchChangeImage),
  ])
}