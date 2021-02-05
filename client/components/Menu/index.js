import React from 'react'
import { Divider } from 'antd'

import UserPanel from './UserPanel'
import Starred from './Starred'
import ChatRooms from './ChatRooms'
import DirectRooms from './DirectRooms'

function Menu() {
  return (
    <div style={{
      backgroundColor: '#415972',
      padding: '1em',
      height: '100vh',
      color: 'white',
      minWidth: '300px',
    }}>
      <div style={{ margin: '10px' }}>
        <UserPanel />
      </div>
      <Divider />
      <div style={{ margin: '10px' }}>
        <Starred />
      </div>
      <Divider />
      <div style={{ margin: '10px' }}>
        <ChatRooms />
      </div>
      <Divider />
      <div style={{ margin: '10px' }}>
        <DirectRooms />
      </div>
    </div >
  )
}

export default Menu
