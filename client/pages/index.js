import React from 'react'
import { END } from 'redux-saga'
import axios from 'axios'
import wrapper from '../store/configureStore'

import Menu from '../components/Menu'
import Main from '../components/Main'

import { AUTH_USER_REQUEST, LOAD_ROOMS_REQUEST, LOAD_DIRECTS_REQUEST, LOAD_CHATS_REQUEST, LOAD_STARS_REQUEST } from '../reducers/types'

function Home() {
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

  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Home
