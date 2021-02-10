import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { END } from 'redux-saga'
import axios from 'axios'
import wrapper from '../store/configureStore'

import Menu from '../components/Menu'
import Main from '../components/Main'

import {
  AUTH_USER_REQUEST, LOAD_ROOMS_REQUEST,
  LOAD_DIRECTS_REQUEST, LOAD_CHATS_REQUEST, LOAD_STARS_REQUEST,
  SOCKET_CONNECT, SOCKET_DISCONNECT,
  SEND_CHAT_SUBSCRIBE, CREATE_ROOM_SUBSCRIBE, CREATE_DIRECT_SUBSCRIBE,
  PRESENCE_USER_SUBSCRIBE, ABSENCE_USER_SUBSCRIBE, LOAD_PRESENCES_REQUEST,
} from '../reducers/types'
import { subscribeChat, subscribeRoom, subscribeDirect, subscribePresence, subscribeAbsence } from '../util/socket'

function Home() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: SOCKET_CONNECT
    })
    subscribeChat((error, message) => {
      dispatch({
        type: SEND_CHAT_SUBSCRIBE,
        data: error || message
      })
    })
    subscribePresence((error, message) => {
      dispatch({
        type: PRESENCE_USER_SUBSCRIBE,
        data: error || message
      })
    })
    subscribeAbsence((error, message) => {
      dispatch({
        type: ABSENCE_USER_SUBSCRIBE,
        data: error || message
      })
    })
    subscribeRoom((error, message) => {
      dispatch({
        type: CREATE_ROOM_SUBSCRIBE,
        data: error || message
      })
    })
    subscribeDirect((error, message) => {
      dispatch({
        type: CREATE_DIRECT_SUBSCRIBE,
        data: error || message
      })
    })
    return () => {
      dispatch({
        type: SOCKET_DISCONNECT
      })
    }
  }, [])

  return (
    <div style={{ display: 'flex' }}>
      <Menu />
      <Main />
    </div>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  axios.defaults.headers.Cookie = '';
  const cookie = context.req ? context.req.headers.cookie : '';
  if (cookie) {
    axios.defaults.headers.Cookie = cookie;
  }

  context.store.dispatch({
    type: AUTH_USER_REQUEST
  });
  context.store.dispatch({
    type: LOAD_ROOMS_REQUEST
  })
  context.store.dispatch({
    type: LOAD_DIRECTS_REQUEST
  })
  context.store.dispatch({
    type: LOAD_CHATS_REQUEST
  })
  context.store.dispatch({
    type: LOAD_STARS_REQUEST
  })
  context.store.dispatch({
    type: LOAD_PRESENCES_REQUEST
  })

  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Home
