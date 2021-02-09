import React, { useCallback } from 'react'
import { Form, Input, Button, Space } from 'antd'
import { useSelector } from 'react-redux'

import { sendChat } from '../../util/socket';

function Sender() {

  const { currentUser } = useSelector(state => state.user)
  const { currentRoom } = useSelector(state => state.room)
  const [form] = Form.useForm();

  const onFinish = useCallback((values) => {
    if (!values.content?.trim()) return;
    sendChat({
      room: currentRoom._id,
      content: values.content,
      writer: currentUser._id
    })
    form.resetFields();
  }, [currentRoom])

  return (
    <div>
      <Form
        form={form}
        name="basic"
        onFinish={onFinish}
      >
        <Form.Item name="content">
          <Input.TextArea placeholder="메세지" disabled={!currentUser._id} />
        </Form.Item>
        <Form.Item>
          <Space style={{ float: 'right' }}>
            <Button type="primary" htmlType="submit" disabled={!currentUser._id} >
              전송
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Sender
