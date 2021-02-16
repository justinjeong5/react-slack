import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid'
import { Typography, Badge } from 'antd'
import { RocketOutlined, PlusSquareOutlined } from '@ant-design/icons'

import ModalForm from './DirectRooms/ModalForm'

import { GET_CURRENT_ROOM, GET_CHATS_OF_ROOM } from '../../reducers/types'

const { Title } = Typography;

function DirectRooms() {

  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user)
  const { currentDirect } = useSelector(state => state.direct)
  const { currentRoom } = useSelector(state => state.room)
  const { readCount } = useSelector(state => state.chat)
  const { presentUsers } = useSelector(state => state.presence)
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

  const count = useCallback((room) => {
    if (!readCount[room._id]) return 0;
    return readCount[room._id].count - readCount[room._id].read
  }, [readCount])

  const style = useCallback((direct) => {
    return direct._id === currentRoom._id ? { backgroundColor: 'gray', borderRadius: 4 } : null;
  }, [currentRoom])

  const renderPresence = useCallback((direct) => {
    const presenceIndex = presentUsers.findIndex(user => user._id === direct.writer._id);
    if (presenceIndex === -1) {
      return <Badge color='gray' />
    }
    const present = presentUsers[presenceIndex].presence;
    return present ? <Badge color='green' /> : <Badge color='gray' />
  }, [presentUsers])

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
      {currentDirect.map(direct => (
        <div
          key={uuidv4()}
          onClick={handleCurrent(direct)}
          style={{ padding: '5px 10px', marginTop: 5, ...style(direct) }}>
          <span>{`# ${direct.title} `} {renderPresence(direct)}</span>
          <Badge showZero={false} count={count(direct)} offset={[7, 0]} size="small" overflowCount='9' />
        </div>))}
      {currentDirect.length === 0 && <div style={{ marginLeft: 25, color: '#c3c3c3' }}>DM을 시작해보세요</div>}
      <ModalForm showModal={showModal} handleShow={handleShow} />
    </div >
  )
}

export default DirectRooms
