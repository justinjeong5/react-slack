import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { END } from 'redux-saga'
import axios from 'axios'
import { Button, Drawer } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import wrapper from '../store/configureStore'

import Menu from '../components/Menu'
import Main from '../components/Main'

import {
  AUTH_USER_REQUEST, LOAD_ROOMS_REQUEST,
  LOAD_DIRECTS_REQUEST, LOAD_CHATS_REQUEST, LOAD_STARS_REQUEST,
  SOCKET_CONNECT, SOCKET_DISCONNECT,
  SEND_CHAT_SUBSCRIBE, CREATE_ROOM_SUBSCRIBE, CREATE_DIRECT_SUBSCRIBE,
  PRESENCE_USER_SUBSCRIBE, ABSENCE_USER_SUBSCRIBE, LOAD_PRESENCES_REQUEST,
  TYPING_START_SUBSCRIBE, TYPING_FINISH_SUBSCRIBE,
} from '../reducers/types'
import {
  subscribeChat, subscribeRoom, subscribeDirect, subscribePresence,
  subscribeAbsence, subscribeTypingStart, subscribeTypingFinish
} from '../util/socket'

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
    subscribeTypingStart((error, message) => {
      dispatch({
        type: TYPING_START_SUBSCRIBE,
        data: error || message
      })
    })
    subscribeTypingFinish((error, message) => {
      dispatch({
        type: TYPING_FINISH_SUBSCRIBE,
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

  const [visible, setVisible] = useState(false)

  const showDrawer = () => {
    setVisible(true)
  };

  const onClose = () => {
    setVisible(false)
  };

  return (
    <div>
      <div style={{ zIndex: 10, position: 'absolute', right: 0 }}>
        <Button
          className="menu__mobile-button"
          type="primary"
          onClick={showDrawer}
        >
          <MenuOutlined />
        </Button>
      </div>
      <div style={{ display: 'flex' }}>
        <div className='menu__normal-wrapper'>
          <Menu />
        </div>
        <div className='main__normal-wrapper'>
          <Main />
        </div>
      </div>
      <Drawer
        width='300px'
        placement="left"
        visible={visible}
        closable={false}
        onClose={onClose}
      >
        <Menu />
      </Drawer>
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
