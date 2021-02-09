const express = require('express');
const router = express.Router();

const { auth } = require('../middleware/auth')
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

router.post('/', auth, (req, res) => {
  const chat = new Chat({ writer: req.user._id, ...req.body })
  chat.save((error, doc) => {
    if (error) {
      console.error(error);
      return res.status(400).json({ message: '채팅을 저장하는 과정에서 문제가 발생했습니다.', error })
    }
    Chat.findOne({ _id: doc._doc._id })
      .populate('writer')
      .exec((error, chat) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ message: '채팅을 불러오는 과정에서 문제가 발생했습니다.', error })
        }
        const fullChat = chat.toJSON();
        delete fullChat.writer.password;
        delete fullChat.writer.token;
        return res.status(200).json({ chat: fullChat })
      })
  })
})

module.exports = router