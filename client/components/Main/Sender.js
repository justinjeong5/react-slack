import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'antd'

import { sendChat, sendTypingFinish, sendTypingStart } from '../../util/socket';

function Sender() {

  const [content, setContent] = useState('')
  const { currentUser } = useSelector(state => state.user)
  const { currentRoom } = useSelector(state => state.room)

  const handleChange = useCallback((e) => {
    setContent(e.target.value)
  }, [])

  useEffect(() => {
    if (content.length === 1) {
      sendTypingStart({
        user: {
          userId: currentUser._id,
          nickname: currentUser.nickname,
        },
        room: currentRoom._id
      })
    }
    if (!content) {
      sendTypingFinish({
        userId: currentUser._id,
        room: currentRoom._id
      })
    }
    // return () => {
    //   sendTypingFinish({
    //     userId: currentUser._id,
    //     room: currentRoom._id
    //   })
    // }
  }, [content, currentUser, currentRoom])

  const handleSubmit = useCallback(() => {
    if (!content.trim()) return;
    sendChat({
      room: currentRoom._id,
      content: content,
      writer: currentUser._id
    })
    setContent('')
  }, [currentRoom, content, currentUser])


  return (
    <div>
      <textarea type="textArea" placeholder="메세지" value={content} onChange={handleChange} style={{ width: '100%' }} disabled={!currentUser._id} />
      <Button type="primary" onClick={handleSubmit} style={{ float: 'right', marginTop: 10 }} disabled={!currentUser._id}>
        전송
      </Button>
    </div>
  )
}

export default Sender
