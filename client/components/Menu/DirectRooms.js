import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid'
import { Typography } from 'antd'
import { RocketOutlined, PlusSquareOutlined } from '@ant-design/icons'

import ModalForm from './DirectRooms/ModalForm'

import { GET_CURRENT_ROOM, GET_CHATS_OF_ROOM } from '../../reducers/types'

const { Title } = Typography;

function DirectRooms() {

  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user)
  const { currentDirect } = useSelector(state => state.direct)
  const { currentRoom } = useSelector(state => state.room)
  const [showModal, setShowModal] = useState(false);
  const handleShow = useCallback(() => {
    setShowModal(prev => !prev)
  }, [])

  const handleCurrent = useCallback((direct) => () => {
    dispatch({
      type: GET_CURRENT_ROOM,
      data: { room: direct }
    })
    dispatch({
      type: GET_CHATS_OF_ROOM,
      data: { roomId: direct._id }
    })
  }, [])

  const style = useCallback((direct) => {
    return direct._id === currentRoom._id ? { backgroundColor: 'gray', borderRadius: 4 } : null;
  }, [currentRoom])


  return (
    <div>
      <Title level={4} style={{ display: 'flex', justifyContent: 'space-between', color: 'white' }}>
        <div>
          <RocketOutlined />{` DIRECT MSG [${currentDirect.length}]`}
        </div>
        <div>
          {currentUser._id && <PlusSquareOutlined onClick={handleShow} />}
        </div>
      </Title>
      {currentDirect.map(direct => (<div key={uuidv4()} onClick={handleCurrent(direct)} style={{ padding: '5px 10px', marginTop: 5, ...style(direct) }}>
        {`# ${direct.title}`}
      </div>))}
      {currentDirect.length === 0 && <div style={{ marginLeft: 25, color: '#c3c3c3' }}>DM을 시작해보세요</div>}
      <ModalForm showModal={showModal} handleShow={handleShow} />
    </div >
  )
}

export default DirectRooms
