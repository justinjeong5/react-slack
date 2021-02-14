const express = require('express');
const router = express.Router();

const { auth } = require('../middleware/auth')
const { User } = require('../models/User')

router.get('/auth', auth, (req, res) => {
  const { password, token, ...fullUser } = req.user._doc;
  return res.status(200).json({ user: fullUser })
})

router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email },
    (error, user) => {
      if (error) {
        console.error(error);
        return res.status(400).json({ message: '중복을 검사하는 과정에서 데이터베이스에 문제가 발생했습니다.', error })
      }
      if (user) {
        return res.status(400).json({ message: '이미 존재하는 사용자입니다.' })
      }

      const newUser = new User(req.body);
      newUser.save((error, doc) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ message: '새로운 유저를 저장하는 과정에서 데이터베이스에 문제가 발생했습니다.', error })
        }
        return res.status(200).json({ user: { _id: doc._doc._id } })
      })
    })
})

router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email },
    (error, user) => {
      if (error) {
        console.error(error);
        return res.status(400).json({ message: '유저를 찾는 과정에서 데이터베이스에 문제가 발생했습니다.', error })
      }
      if (!user) {
        return res.status(400).json({ message: '존재하지 않는 사용자입니다.' })
      }
      user.comparePassword(req.body.password, (error, match) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ message: '비밀번호를 검증하는 과정에서 문제가 발생했습니다.', error })
        }
        if (!match) {
          return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' })
        }
        user.generateToken((error, user) => {
          if (error) {
            console.error(error);
            return res.status(400).json({ message: '토큰을 생성하는 과정에서 문제가 발생했습니다.', error })
          }
          const { password, token, ...fullUser } = user._doc;
          return res.cookie(process.env.COOKIE_NAME, token).status(200).json({ user: fullUser })
        })
      })
    })
})

router.patch('/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id },
    { token: '' },
    (error, user) => {
      if (error) {
        console.error(error);
        return res.status(400).json({ message: '데이터베이스에 접근/수정하는 과정에서 문제가 발생했습니다.' }, error);
      }
      if (!user) {
        return res.status(400).json({ message: '존재하지 않는 사용자입니다.' })
      }
      return res.cookie(process.env.COOKIE_NAME, '').status(200).json({ user: {} });
    })
})

router.get('/users', auth, (req, res) => {
  User.find().exec((error, users) => {
    if (error) {
      console.error(error);
      return res.status(400).json({ message: '사용자 목록을 가져오는 과정에서 문제가 발생했습니다.', error })
    }
    const fullUsers = users.map(user => {
      const fullUser = user.toJSON();
      delete fullUser.password;
      delete fullUser.token;
      return fullUser;
    })
    return res.status(200).json({ users: fullUsers })
  })
})

module.exports = router