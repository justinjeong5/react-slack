import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid'
import { Typography } from 'antd'
import { MessageOutlined, PlusSquareOutlined } from '@ant-design/icons'

import ModalForm from './ChatRooms/ModalForm';

import { GET_CURRENT_ROOM, GET_CHATS_OF_ROOM, } from '../../reducers/types';

const { Title } = Typography;

function ChatRooms() {

  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user)
  const { currentRoom, roomList } = useSelector(state => state.room)
  const [showModal, setShowModal] = useState(false);
  const handleShow = useCallback(() => {
    setShowModal(prev => !prev)
  }, [])

  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_ROOM_REQUEST
  //   })
  // }, [])

  const handleCurrent = useCallback((room) => () => {
    dispatch({
      type: GET_CURRENT_ROOM,
      data: { room }
    })
    dispatch({
      type: GET_CHATS_OF_ROOM,
      data: { roomId: room.id }
    })
  }, [])

  const style = useCallback((room) => {
    return room.id === currentRoom.id ? { backgroundColor: 'gray', borderRadius: 4 } : null;
  }, [currentRoom])


  return (
    <div>
      <Title level={4} style={{ color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <MessageOutlined />{` CHANNELS [${roomList.length}]`}
          </div>
          <div>
            {currentUser.uid && <PlusSquareOutlined onClick={handleShow} />}
          </div>
        </div>
      </Title>
      {roomList.map(room => (<div key={uuidv4()} onClick={handleCurrent(room)} style={{ padding: '5px 10px', marginTop: 5, ...style(room) }}>
        {`# ${room.title}`}
      </div>))}
      <ModalForm showModal={showModal} handleShow={handleShow} />
    </div >
  )
}

export default ChatRooms
