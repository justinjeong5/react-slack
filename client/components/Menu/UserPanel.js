import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import mime from 'mime-types'
import { Typography, Space, notification, Image, Dropdown, Menu, message } from 'antd'
import { SlackOutlined, DownOutlined } from '@ant-design/icons'

import RegisterUser from './User/RegisterUser'
import LoginUser from './User/LoginUser'
import LogoutUser from './User/LogoutUser'

import { UPLOAD_IMAGE_REQUEST, RESET_USER_STORE } from '../../reducers/types'

const { Title } = Typography;

function UserPanel() {

  const inputOpenImageRef = useRef();
  const dispatch = useDispatch();
  const { currentUser, loginUserDone } = useSelector(state => state.user)
  const { uploadImageLoading, uploadImageDone } = useSelector(state => state.image)

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
    if (uploadImageLoading) {
      notification.open({
        message: '프로필 사진 변경중',
        description: '프로필 사진을 변경하고 있습니다.'
      })
    }
    if (uploadImageDone) {
      message.success('프로필 사진이 변경되었습니다.')
    }
  }, [loginUserDone, uploadImageLoading, uploadImageDone])

  const handleUploadImageRef = () => {
    inputOpenImageRef.current.click();
  }

  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    const metadata = { contentType: mime.lookup(file.name) };
    dispatch({
      type: UPLOAD_IMAGE_REQUEST,
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
            <Menu.Item disabled={uploadImageLoading} onClick={handleUploadImageRef}>프로필 사진 변경</Menu.Item>
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
