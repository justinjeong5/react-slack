import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { Typography } from 'antd'
import { StarOutlined } from '@ant-design/icons'

import { GET_CURRENT_ROOM, GET_CHATS_OF_ROOM } from '../../reducers/types'

const { Title } = Typography

function Starred() {

  const dispatch = useDispatch();
  const { starList } = useSelector(state => state.star)
  const { currentRoom } = useSelector(state => state.room)

  const handleCurrent = useCallback((star) => () => {
    dispatch({
      type: GET_CURRENT_ROOM,
      data: { room: star }
    })
    dispatch({
      type: GET_CHATS_OF_ROOM,
      data: { roomId: star._id }
    })
  }, [])

  const style = useCallback((star) => {
    return star._id === currentRoom._id ? { backgroundColor: 'gray', borderRadius: 4 } : null;
  }, [currentRoom])


  return (
    <div>
      <Title level={4} style={{ color: 'white' }}>
        <div>
          <StarOutlined />{` STARRED [${starList.length}]`}
        </div>
      </Title>
      {starList.map(star => (<div key={uuidv4()} onClick={handleCurrent(star)} style={{ padding: '5px 10px', marginTop: 5, ...style(star) }}>
        {`# ${star.title}`}
      </div>))}
    </div>
  )
}

export default Starred
