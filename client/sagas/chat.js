import { all, put, fork, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios'
import {
  SEND_CHAT_REQUEST, SEND_CHAT_SUCCESS, SEND_CHAT_FAILURE,
} from '../reducers/types'

function sendChatAPI(data) {
  return axios.post('/chat', data)
}

function* sendChat(action) {
  try {
    const result = yield call(sendChatAPI, action.data);
    yield put({
      type: SEND_CHAT_SUCCESS,
      data: {
        chat: result.data
      }
    })
  } catch (error) {
    console.error(error)
    yield put({
      type: SEND_CHAT_FAILURE,
      error: error
    })
  }
}

function* watchSendChat() {
  yield takeLatest(SEND_CHAT_REQUEST, sendChat)
}


export default function* chatSaga() {
  yield all([
    fork(watchSendChat),
  ])
}