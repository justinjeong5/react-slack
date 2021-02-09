import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid'
import { Typography, notification, Badge } from 'antd'
import { MessageOutlined, PlusSquareOutlined } from '@ant-design/icons'

import ModalForm from './ChatRooms/ModalForm';

import { GET_CURRENT_ROOM, GET_CHATS_OF_ROOM, } from '../../reducers/types';

const { Title } = Typography;

function ChatRooms() {

  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user)
  const { currentRoom, roomList, createRoomDone } = useSelector(state => state.room)
  const { readCount } = useSelector(state => state.chat)
  const [showModal, setShowModal] = useState(false);
  const handleShow = useCallback(() => {
    setShowModal(prev => !prev)
  }, [])

  useEffect(() => {
    if (createRoomDone && !showModal) {
      setShowModal(false);
      notification.open({
        message: '알립니다.',
        description: '새로운 대화방이 생성되었습니다.'
      })
    }
    if (roomList.length) {
      dispatch({
        type: GET_CURRENT_ROOM,
        data: {
          room: roomList[0]
        }
      })
    }
  }, [createRoomDone])

  const handleCurrent = useCallback((room) => () => {
    dispatch({
      type: GET_CURRENT_ROOM,
      data: { room }
    })
    dispatch({
      type: GET_CHATS_OF_ROOM,
      data: { roomId: room._id }
    })
  }, [])

  const count = useCallback((room) => {
    if (!readCount[room._id]) return 0;
    return readCount[room._id].count - readCount[room._id].read
  }, [readCount])

  const style = useCallback((room) => {
    return room._id === currentRoom._id ? { backgroundColor: 'gray', borderRadius: 4 } : null;
  }, [currentRoom])

  return (
    <div>
      <Title level={4} style={{ color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <MessageOutlined />{` CHANNELS [${roomList.length}]`}
          </div>
          <div>
            {currentUser._id && <PlusSquareOutlined onClick={handleShow} />}
          </div>
        </div>
      </Title>
      {roomList.map(room => (
        <div
          key={uuidv4()}
          onClick={handleCurrent(room)}
          style={{ padding: '5px 10px', marginTop: 5, ...style(room) }}>
          <span>{`# ${room.title}`}</span>
          <Badge showZero={false} count={count(room)} offset={[7, 0]} size="small" overflowCount='9' />
        </div>
      ))}
      {roomList.length === 0 && <div style={{ marginLeft: 25, color: '#c3c3c3' }}>대화를 시작해보세요</div>}
      <ModalForm showModal={showModal} handleShow={handleShow} />
    </div >
  )
}

export default ChatRooms
