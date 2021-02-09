import React, { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { Card, Image } from 'antd'

import { GET_CHATS_OF_ROOM } from '../../reducers/types'

function Messages() {

  let messagesBottomRef = useRef();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user)
  const { currentRoom } = useSelector(state => state.room)
  const { currentChats } = useSelector(state => state.chat)

  const cardTitle = useCallback((chat) => (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>{chat.writer.nickname}</span>
      <span style={{ fontSize: '0.8em', color: 'gray', fontWeight: 300 }}>{moment(chat.createdAt).fromNow()}</span>
    </div>
  ), [])

  useEffect(() => {
    dispatch({
      type: GET_CHATS_OF_ROOM,
      data: { roomId: currentRoom._id }
    })
  }, [currentRoom])

  useEffect(() => {
    messagesBottomRef.scrollIntoView();
  }, [messagesBottomRef, currentChats])

  const isMessageMine = useCallback((chat) => {
    return chat.writer._id === currentUser._id
  }, [currentUser])

  const renderMyMessage = useCallback((chat) => (
    <div key={uuidv4()} style={{ marginLeft: 50 }}>
      {renderMessage(chat)}
    </div>
  ), [])

  const renderMessage = useCallback((chat) => (
    <div key={uuidv4()}>
      <Card style={{ border: 'none' }}>
        <Card.Meta
          avatar={<Image
            style={{ height: 40, width: 40, borderRadius: 20 }}
            src={chat.writer.image}
          />}
          title={cardTitle(chat)}
          description={<span style={{ color: '#3f3f3f' }}>{chat.content}</span>}
        />
      </Card>
    </div>
  ), [])

  return (
    <div style={{ height: 'calc(100vh - 400px)', overflowY: 'scroll', border: '3px #f3f3f3 solid' }}>
      {currentChats.map(chat => (
        isMessageMine(chat)
          ? renderMyMessage(chat)
          : renderMessage(chat))
      )}
      <div ref={node => messagesBottomRef = node}></div>
    </div>
  )
}

export default Messages
