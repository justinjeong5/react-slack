import React, { useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { Card, Image, Empty } from 'antd'

moment.locale('ko')

function Messages() {

  let messagesBottomRef = useRef();
  const { currentUser } = useSelector(state => state.user)
  const { currentChats } = useSelector(state => state.chat)
  const { currentRoom } = useSelector(state => state.room)

  const cardTitle = useCallback((chat) => (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>{chat.writer.nickname}</span>
      <span style={{ fontSize: '0.8em', color: 'gray', fontWeight: 300 }}>{moment(chat.createdAt).fromNow()}</span>
    </div>
  ), [])

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
          description={<div>
            <span style={{ color: '#3f3f3f' }}>{chat.content}</span>
            <div>{chat.image && <Image src={chat.image} style={{ maxWidth: 200, maxHeight: 200 }} />}</div>
          </div>}
        />
      </Card>
    </div>
  ), [])

  return (
    <div>
      <div style={{ height: 'calc(100vh - 400px)', overflowY: 'scroll', border: '3px #f3f3f3 solid' }}>
        {currentChats.map(chat => (
          isMessageMine(chat)
            ? renderMyMessage(chat)
            : renderMessage(chat))
        )}

        {currentChats.length === 0 && <Empty description='대화를 시작해보세요!' style={{ marginTop: 100 }} />}
        <div ref={node => messagesBottomRef = node}></div>
      </div>
      <div style={{ height: 15 }}>
        {currentRoom.typing?.length > 0 && (
          currentRoom.typing.length === 1
            ? `${currentRoom.typing[0].nickname}님이 대화를 입력하고 있습니다.`
            : `${currentRoom.typing[0].nickname}님 외 ${currentRoom.typing.length - 1}명이 대화를 입력하고 있습니다.`
        )}
      </div>
    </div>
  )
}

export default Messages
