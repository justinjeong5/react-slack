import React, { useCallback, useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, Form, Input, Button, Space, message } from 'antd'
import { LoginOutlined, MailOutlined, LockOutlined } from '@ant-design/icons'
import { LOGIN_USER_REQUEST } from '../../../reducers/types'

function LoginUser() {

  const dispatch = useDispatch();
  const { loginUserLoading, loginUserError } = useSelector(state => state.user)
  const [showModal, setShowModal] = useState(false)

  const handleShow = useCallback(() => {
    setShowModal(prev => !prev)
  }, [])

  useEffect(() => {
    if (loginUserError) {
      message.error(loginUserError.message)
    }
  }, [loginUserError])

  const onFinish = useCallback((values) => {
    dispatch({
      type: LOGIN_USER_REQUEST,
      data: {
        email: values.email,
        password: values.password,
      }
    })
  }, []);


  const formEmailRules = useMemo(() => ([
    { required: true, message: '이메일을 입력해주세요.' },
    { type: 'email', message: '이메일의 형식이 올바르지 않습니다.' }
  ]), [])
  const formPasswordRules = useMemo(() => ([
    { required: true, message: '비밀번호를 입력해주세요.' },
    { min: 6, message: '비밀번호는 6자리보다 길어야합니다.' }
  ]), [])


  return (
    <div>
      <LoginOutlined
        onClick={handleShow}
      />
      <Modal
        title={<span><LoginOutlined /> 로그인</span>}
        visible={showModal}
        onCancel={handleShow}
        footer={[]}
      >
        <Form
          name="basic"
          onFinish={onFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ width: '400px' }}
        >
          <Form.Item
            label="이메일"
            name="email"
            rules={formEmailRules}
          >
            <Input prefix={<MailOutlined />} placeholder="이메일" />
          </Form.Item>
          <Form.Item
            label="비밀번호"
            name="password"
            rules={formPasswordRules}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="비밀번호" />
          </Form.Item>
          <Form.Item
            wrapperCol={{ offset: 8, span: 16 }}
          >
            <Space style={{ float: 'right' }}>
              <Button onClick={handleShow} disabled={loginUserLoading}>
                취소
              </Button>
              <Button type="primary" htmlType="submit" disabled={loginUserLoading} loading={loginUserLoading}>
                로그인
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default LoginUser
