import { all, put, fork, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios'
import {
  LOAD_CHATS_REQUEST, LOAD_CHATS_SUCCESS, LOAD_CHATS_FAILURE,
  SEND_CHAT_SUBSCRIBE, SEND_CHAT_SUCCESS, SEND_CHAT_FAILURE,
} from '../reducers/types'

function loadChatsAPI(data) {
  return axios.get('/chat/chats', data)
}

function* loadChats(action) {
  try {
    const result = yield call(loadChatsAPI, action.data);
    yield put({
      type: LOAD_CHATS_SUCCESS,
      data: result.data
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: LOAD_CHATS_FAILURE,
      error: error.response.data
    })
  }
}

function* sendChat(action) {
  if (!action.error) {
    yield put({
      type: SEND_CHAT_SUCCESS,
      data: action.data
    })
  } else {
    console.error(action.error)
    yield put({
      type: SEND_CHAT_FAILURE,
      error: action.error
    })
  }
}

function* watchLoadChats() {
  yield takeLatest(LOAD_CHATS_REQUEST, loadChats)
}

function* watchSendChat() {
  yield takeLatest(SEND_CHAT_SUBSCRIBE, sendChat)
}


export default function* chatSaga() {
  yield all([
    fork(watchLoadChats),
    fork(watchSendChat),
  ])
}