import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Form, Input, Space, message, notification } from 'antd'
import { UserAddOutlined, MailOutlined, UserOutlined, LockOutlined, CheckSquareOutlined } from '@ant-design/icons'
import { REGISTER_USER_REQUEST } from '../../../reducers/types'
function RegisterUser() {

  const dispatch = useDispatch();
  const { registerUserLoading, registerUserError } = useSelector(state => state.user)
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();

  const handleShow = useCallback(() => {
    setShowModal(prev => !prev)
  }, [])

  useEffect(() => {
    if (registerUserError) {
      message.error(registerUserError.message)
    }
    if (registerUserLoading) {
      notification.open({
        message: '회원가입 시도중',
        description: '회원가입이 완료되면 자동으로 로그인 됩니다.',
      })
    }
  }, [registerUserError, registerUserLoading])

  const onFinish = useCallback((values) => {
    dispatch({
      type: REGISTER_USER_REQUEST,
      data: {
        email: values.email,
        nickname: values.nickname,
        password: values.password
      }
    })
  }, []);

  const formEmailRules = useMemo(() => ([
    { required: true, message: '이메일을 입력해주세요.' },
    { type: "email", message: '이메일의 형식이 올바르지 않습니다.' }
  ]), [])
  const formNicknameRules = useMemo(() => ([
    { required: true, message: '이름을 입력해주세요.' },
    { type: "string", max: 20, message: '이름은 20자 이내로 입력해주세요' }
  ]), [])
  const fromPasswordRules = useMemo(() => ([
    { required: true, message: '비밀번호를 입력해주세요.' },
    { type: "string", message: '비밀번호의 형식이 올바르지 않습니다.' },
    { whitespace: false, message: '비밀번호의 형식이 올바르지 않습니다.' },
    { min: 6, message: '비밀번호는 6글자보다 길어야합니다.' }
  ]), [])
  const formPasswordConfirmRules = useMemo(() => ([
    { required: true, message: '비밀번호를 입력해주세요.' },
    ({ getFieldValue }) => ({
      validator(rule, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject('비밀번호 확인이 일치하지 않습니다.');
      },
    })
  ]), [])


  return (
    <div>
      <UserAddOutlined
        onClick={handleShow}
      />
      <Modal
        title={<span><UserAddOutlined /> 회원가입</span>}
        visible={showModal}
        onCancel={handleShow}
        footer={[]}
      >
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          form={form}
          style={{ width: '400px' }}
          onFinish={onFinish}
        >
          <Form.Item
            label="이메일"
            name="email"
            rules={formEmailRules}
          >
            <Input prefix={<MailOutlined />} placeholder="이메일" />
          </Form.Item>
          <Form.Item
            label="이름"
            name="nickname"
            rules={formNicknameRules}
          >
            <Input prefix={<UserOutlined />} placeholder="이름" />
          </Form.Item>
          <Form.Item
            label="비밀번호 "
            name="password"
            rules={fromPasswordRules}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="특수기호 포함, 6자리 이상" />
          </Form.Item>
          <Form.Item
            label="비밀번호 확인"
            name="passwordConfirm"
            rules={formPasswordConfirmRules}
          >
            <Input.Password prefix={<CheckSquareOutlined />} placeholder="비밀번호 확인" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Space style={{ float: 'right' }}>
              <Button onClick={handleShow} disabled={registerUserLoading}>
                취소
              </Button>
              <Button type="primary" htmlType="submit" disabled={registerUserLoading} loading={registerUserLoading}>
                회원가입
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default RegisterUser
