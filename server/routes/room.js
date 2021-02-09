const express = require('express');
const router = express.Router();

const { auth } = require('../middleware/auth');
const { Room } = require('../models/Room')


router.get('/rooms', (req, res) => {
  Room.find()
    .populate('writer')
    .exec((error, rooms) => {
      if (error) {
        console.error(error);
        return res.status(400).json({ message: '방 목록을 불러오는 과정에서 문제가 발생했습니다.', error })
      }
      const fullRooms = rooms.map(room => {
        const fullRoom = room.toJSON();
        delete fullRoom.writer.password;
        delete fullRoom.writer.token;
        return fullRoom;
      })
      return res.status(200).json({ rooms: fullRooms })
    })
})

module.exports = router


router.post('/', auth, (req, res) => {
  const room = new Room({ writer: req.user._id, ...req.body });
  room.save((error, doc) => {
    if (error) {
      console.error(error);
      return res.status(400).json({ message: '방을 생성하는 과정에서 문제가 발생했습니다.', error })
    }
    Room.findOne({ _id: doc._doc._id })
      .populate('writer')
      .exec((error, room) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ message: '생성한 방 정보를 얻는 과정에서 문제가 발생했습니다.', error })
        }
        const fullRoom = room.toJSON();
        delete fullRoom.writer.password;
        delete fullRoom.writer.token;
        return res.status(200).json({ room: fullRoom })
      })
  })
})

module.exports = router 