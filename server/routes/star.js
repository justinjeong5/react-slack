const express = require('express');
const router = express.Router();

const { Room } = require('../models/Room')
const { Direct } = require('../models/Direct');
const { auth } = require('../middleware/auth');


router.get('/stars', auth, (req, res) => {
  Direct.find({ starred: { $in: [req.user._id] } })
    .populate('user1')
    .populate('user2')
    .exec((error, directs) => {
      if (error) {
        console.error(error);
        return res.status(400).json({ message: '좋아요 DM을 불러오는 과정에서 문제가 발생했습니다.', error })
      }
      const fullDirects = directs.map(direct => {
        const fullDirect = direct.toJSON();
        delete fullDirect.user1.password;
        delete fullDirect.user1.token;
        delete fullDirect.user2.password;
        delete fullDirect.user2.token;
        return fullDirect;
      })
      Room.find({ starred: { $in: [req.user._id] } })
        .populate('writer')
        .exec((error, rooms) => {
          if (error) {
            console.error(error);
            return res.status(400).json({ message: '좋아요 채팅방을 불러오는 과정에서 문제가 발생했습니다.', error })
          }
          const fullRooms = rooms.map(room => {
            const fullRoom = room.toJSON();
            delete fullRoom.writer.password;
            delete fullRoom.writer.token;
            return fullRoom;
          })
          return res.status(200).json({ directs: fullDirects, rooms: fullRooms, userId: req.user._id });
        })
    })
})

router.post('/', auth, (req, res) => {
  const type = req.body.type;
  if (type === 'public') {
    Room.findOneAndUpdate({ _id: req.body.roomId },
      { $push: { starred: req.user._id } },
      (error, doc) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ message: '즐겨찾기를 저장하는 과정에서 문제가 발생했습니다.', error })
        }
        Room.findOne({ _id: doc._doc._id })
          .populate('writer')
          .exec((error, star) => {
            if (error) {
              console.error(error);
              return res.status(400).json({ message: '즐겨찾기 글을 불러오는 과정에서 문제가 발생했습니다.', error })
            }
            const fullStar = star.toJSON();
            delete fullStar.writer.password;
            delete fullStar.writer.token;
            return res.status(200).json({ star: fullStar, userId: req.user._id })
          })
      })
  } else if (type === 'private') {
    Direct.findOneAndUpdate({ _id: req.body.roomId },
      { $push: { starred: req.user._id } },
      (error, doc) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ message: '즐겨찾기를 저장하는 과정에서 문제가 발생했습니다.', error })
        }
        Direct.findOne({ _id: doc._doc._id })
          .populate('user1')
          .populate('user2')
          .exec((error, star) => {
            if (error) {
              console.error(error);
              return res.status(400).json({ message: '즐겨찾기 글을 불러오는 과정에서 문제가 발생했습니다.', error })
            }
            const fullStar = star.toJSON();
            delete fullStar.user1.password;
            delete fullStar.user1.token;
            delete fullStar.user2.password;
            delete fullStar.user2.token;
            return res.status(200).json({ star: fullStar, userId: req.user._id })
          })
      })
  } else {
    return res.status(400).json({ message: '유효하지 않은 type 정보가 입력되었습니다.' })
  }
})

router.patch('/', auth, (req, res) => {
  const type = req.body.type;
  if (type === 'public') {
    Room.findOneAndUpdate({ _id: req.body.roomId },
      { $pull: { starred: { $in: [req.user._id] } } },
      (error, doc) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ message: '즐겨찾기를 제거하는 과정에서 문제가 발생했습니다.', error })
        }
        Room.findOne({ _id: doc._doc._id })
          .populate('writer')
          .exec((error, star) => {
            if (error) {
              console.error(error);
              return res.status(400).json({ message: '즐겨찾기 글을 불러오는 과정에서 문제가 발생했습니다.', error })
            }
            const fullStar = star.toJSON();
            delete fullStar.writer.password;
            delete fullStar.writer.token;
            return res.status(200).json({ star: fullStar })
          })
      })
  } else if (type === 'private') {
    Direct.findOneAndUpdate({ _id: req.body.roomId },
      { $pull: { starred: { $in: [req.user._id] } } },
      (error, doc) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ message: '즐겨찾기를 제거하는 과정에서 문제가 발생했습니다.', error })
        }
        Direct.findOne({ _id: doc._doc._id })
          .populate('user1')
          .populate('user2')
          .exec((error, star) => {
            if (error) {
              console.error(error);
              return res.status(400).json({ message: '즐겨찾기 글을 불러오는 과정에서 문제가 발생했습니다.', error })
            }
            const fullStar = star.toJSON();
            delete fullStar.user1.password;
            delete fullStar.user1.token;
            delete fullStar.user2.password;
            delete fullStar.user2.token;
            return res.status(200).json({ star: fullStar })
          })
      })
  } else {
    return res.status(400).json({ message: '유효하지 않은 type 정보가 입력되었습니다.' })
  }
})

module.exports = router