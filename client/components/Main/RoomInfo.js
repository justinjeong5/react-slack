import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Typography, Card, Image } from 'antd'

const { Title } = Typography;

function RoomInfo() {

  const { currentRoom } = useSelector(state => state.room)

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
    </div>
  )
}

export default RoomInfo
