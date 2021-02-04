import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import mime from 'mime-types'
import { Typography, Space, notification, Image, Dropdown, Menu } from 'antd'
import { SlackOutlined, DownOutlined } from '@ant-design/icons'

import RegisterUser from './User/RegisterUser'
import LoginUser from './User/LoginUser'
import LogoutUser from './User/LogoutUser'

import { CHANGE_IMAGE_REQUEST, RESET_USER_STORE } from '../../reducers/types'

const { Title } = Typography;

function UserPanel() {

  const inputOpenImageRef = useRef();
  const dispatch = useDispatch();
  const { currentUser, loginUserDone } = useSelector(state => state.user)

  useEffect(() => {
    if (loginUserDone) {
      notification.open({
        message: '환영합니다.',
        description: `반갑습니다. ${currentUser.nickname}님`
      })
      setTimeout(() => {
        dispatch({
          type: RESET_USER_STORE,
        })
      }, 1000)
    }
  }, [loginUserDone])

  const handleUploadImageRef = () => {
    inputOpenImageRef.current.click();
  }

  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    const metadata = { contentType: mime.lookup(file.name) };
    dispatch({
      type: CHANGE_IMAGE_REQUEST,
      data: {
        uid: currentUser.uid,
        file,
        metadata
      }
    })
  }

  return (
    <div >
      <Title level={3} style={{ display: 'flex', justifyContent: 'space-between', color: 'white' }}>
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
      {currentUser.uid && <div style={{ display: 'flex', marginBottom: '1rem' }}>
        <Image
          style={{ width: 40, height: 40, marginTop: 3, borderRadius: 20 }}
          src={currentUser.image} />
        <Dropdown
          overlay={<Menu>
            <Menu.Item onClick={handleUploadImageRef}>프로필 사진 변경</Menu.Item>
          </Menu>}
          trigger={['click']}
        >
          <span style={{ marginLeft: 10 }} onClick={(e) => e.preventDefault()}>
            <div>
              <div style={{ fontSize: '1.2em' }}>{currentUser.nickname}</div>
              <div>{currentUser.email} <DownOutlined /></div>
            </div>

          </span>
        </Dropdown>
      </div>}
      <input
        type='file'
        accept='image/jpeg, image/png'
        hidden
        onChange={handleUploadImage}
        ref={inputOpenImageRef} />
    </div >
  )
}

export default UserPanel
