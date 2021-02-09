import React, { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Typography, Card, Image, message } from 'antd'
import { StarOutlined, LockFilled, UnlockOutlined, StarFilled } from '@ant-design/icons'

import { ADD_STAR_REQUEST, REMOVE_STAR_REQUEST } from '../../reducers/types'

const { Title } = Typography;

function RoomInfo() {

  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user)
  const { currentRoom } = useSelector(state => state.room)

  const handleStar = useCallback(() => {
    if (!currentUser._id) {
      return message.warning('로그인이 필요한 서비스입니다.');
    }
    const data = {
      roomId: currentRoom._id,
      type: currentRoom.private ? 'private' : 'public'
    }
    dispatch({
      type: ADD_STAR_REQUEST,
      data
    })
  }, [currentRoom, currentUser])

  const handleUnstar = useCallback(() => {
    if (!currentUser._id) {
      return message.warning('로그인이 필요한 서비스입니다.');
    }
    const data = {
      roomId: currentRoom._id,
      type: currentRoom.private ? 'private' : 'public'
    }
    dispatch({
      type: REMOVE_STAR_REQUEST,
      data
    })
  }, [currentRoom, currentUser])

  const rootDivStyle = useMemo(() => ({
    width: '100%',
    height: '100%',
    minHeight: '150px',
    padding: '1em',
    marginBottom: '1em'
  }), [])

  return (
    <div style={rootDivStyle}>
      {currentRoom?.title &&
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }} >
          <div>
            <Title level={2}>{currentRoom.title}</Title>
            <p>{currentRoom.description}</p>
          </div>
          <Card style={{ border: 'none' }}>
            <Card.Meta
              avatar={<Image
                style={{ height: 50, width: 50, borderRadius: 25 }}
                src={currentRoom.writer.image}
              />}
              title={currentRoom.writer.nickname}
              description={currentRoom.writer.email}
            />
          </Card>
        </div>
      }
      <div style={{ float: 'right', marginRight: 30, fontSize: '1.5em' }}>
        {currentRoom.starred?.includes(currentUser._id)
          ? <StarFilled onClick={handleUnstar} />
          : <StarOutlined onClick={handleStar} />}
        {currentRoom.privates
          ? <LockFilled />
          : <UnlockOutlined />}

      </div>
    </div>
  )
}

export default RoomInfo
