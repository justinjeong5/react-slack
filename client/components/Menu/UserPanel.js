import React from 'react'
import { Typography, Space } from 'antd'
import { SlackOutlined } from '@ant-design/icons'

import RegisterUser from './User/RegisterUser'
import LoginUser from './User/LoginUser'
import LogoutUser from './User/LogoutUser'


const { Title } = Typography;

function UserPanel() {

  return (
    <div >
      <Title level={4} style={{ display: 'flex', justifyContent: 'space-between', color: 'white' }}>
        <div>
          <SlackOutlined /> React Slack
        </div>
        <div style={{ display: 'flex' }}>
          {currentUser.uid
            ? <LogoutUser />
            : <Space>
              <LoginUser />
              <RegisterUser />
            </Space>}
        </div>
      </Title>
    </div >
  )
}

export default UserPanel
