import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Space, Image, message } from 'antd'

import { sendChat, sendTypingFinish, sendTypingStart } from '../../util/socket';
import { UPLOAD_IMAGE_REQUEST, CLEAR_IMAGE } from '../../reducers/types'

function Sender() {

  const dispatch = useDispatch();
  const inputOpenImageRef = useRef();
  const [content, setContent] = useState('')
  const { currentUser } = useSelector(state => state.user)
  const { currentRoom } = useSelector(state => state.room)
  const { imagePath, uploadImageLoading } = useSelector(state => state.image)

  const handleChange = useCallback((e) => {
    if (e.target.value.split('').indexOf('\n') < 0) {
      setContent(e.target.value)
    }
  }, [])

  const handleImageRef = () => {
    inputOpenImageRef.current.click();
  }

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
    if (!content.trim() && !imagePath) return;
    if (!currentUser._id) return message.error('잘못된 접근입니다!');

    sendChat({
      room: currentRoom._id,
      content: content,
      image: imagePath,
      writer: currentUser._id
    })
    dispatch({
      type: CLEAR_IMAGE
    })
    setContent('')
  }, [currentRoom, content, currentUser, imagePath])

  const handleImage = useCallback((event) => {
    const imageFormData = new FormData();
    imageFormData.append('image', event.target.files[0])

    dispatch({
      type: UPLOAD_IMAGE_REQUEST,
      data: imageFormData
    })
  }, [])

  const handleImageRemove = useCallback(() => {
    dispatch({
      type: CLEAR_IMAGE
    })
  }, [])

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  return (
    <div>
      <textarea
        type='textArea'
        placeholder='메세지'
        value={content}
        onChange={handleChange}
        onKeyPress={handleEnter}
        style={{ width: '100%' }}
        disabled={!currentUser._id}
      />
      <Space style={{ float: 'right', marginTop: 10 }}>
        {imagePath
          ? <Button onClick={handleImageRemove}>이미지 제거</Button>
          : <Button
            onClick={handleImageRef}
            loading={uploadImageLoading}
            disabled={!currentUser._id || uploadImageLoading}
          >이미지</Button>}
        <Button type='primary' onClick={handleSubmit} disabled={!currentUser._id || uploadImageLoading}>
          전송
        </Button>
      </Space>
      <div>
        {imagePath && <Image src={imagePath} style={{ maxWidth: 100 }} />}
      </div>
      <input
        type='file'
        accept='image/jpeg, image/png'
        hidden
        onChange={handleImage}
        ref={inputOpenImageRef} />
    </div>
  )
}

export default Sender
