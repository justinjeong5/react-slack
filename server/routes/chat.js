const express = require('express');
const router = express.Router();

const { Chat } = require('../models/Chat')

router.get('/chats', (req, res) => {
  Chat.find()
    .populate('writer')
    .exec((error, chats) => {
      if (error) {
        console.error(error);
        return res.status(400).json({ message: '전체 채팅을 불러오는 과정에서 문제가 발생했습니다.', error })
      }
      const fullChats = chats.map(chat => {
        const fullChat = chat.toJSON();
        delete fullChat.writer.password;
        delete fullChat.writer.token;
        return fullChat;
      })
      return res.status(200).json({ chats: fullChats })
    })
})

module.exports = router