import React, { useCallback } from 'react'
import { Form, Input, Button, Space } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { SEND_CHAT_REQUEST } from '../../reducers/types';

function Sender() {

  const dispatch = useDispatch();
  const { currentRoom } = useSelector(state => state.room)
  const [form] = Form.useForm();

  const onFinish = useCallback((values) => {
    if (!values.content?.trim()) return;
    dispatch({
      type: SEND_CHAT_REQUEST,
      data: {
        room: currentRoom._id,
        content: values.content,
      }
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
          <Input.TextArea placeholder="메세지" />
        </Form.Item>
        <Form.Item>
          <Space style={{ float: 'right' }}>
            <Button type="primary" htmlType="submit" >
              전송
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Sender
