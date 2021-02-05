import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid'
import { Typography } from 'antd'
import { RocketOutlined } from '@ant-design/icons'

import { GET_CURRENT_ROOM, GET_CHATS_OF_ROOM } from '../../reducers/types'

const { Title } = Typography;

function DirectRooms() {

  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user)
  const { userList } = useSelector(state => state.users)
  const { currentRoom } = useSelector(state => state.room)

  const getRoomId = useCallback((user) => {
    if (user.uid > currentUser.uid) {
      return `${user.uid}/${currentUser.uid}`
    }
    return `${currentUser.uid}/${user.uid}`
  }, [currentUser])

  const handleCurrent = useCallback((user) => () => {
    dispatch({
      type: GET_CURRENT_ROOM,
      data: { room: user }
    })
    dispatch({
      type: GET_CHATS_OF_ROOM,
      data: { roomId: getRoomId(user) }
    })
  }, [])

  const style = useCallback((user) => {
    return currentRoom.id && currentRoom.id.includes(user.uid) ? { backgroundColor: 'gray', borderRadius: 4 } : null;
  }, [currentRoom])


  return (
    <div>
      <Title level={4} style={{ color: 'white' }}>
        <div>
          <RocketOutlined />{` DIRECT MESSAGES [${userList.length}]`}
        </div>
      </Title>
      {userList.map(user => (<div key={uuidv4()} onClick={handleCurrent(user)} style={{ padding: '5px 10px', marginTop: 5, ...style(user) }}>
        {`# ${user.nickname}`}
      </div>))}
    </div>
  )
}

export default DirectRooms
