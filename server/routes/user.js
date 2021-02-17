/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - nickname
 *         - password
 *         - image
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated _id of the user.
 *         email:
 *           type: string
 *           description: The email of user.
 *         nickname:
 *           type: string
 *           description: The nickname of user.
 *         image:
 *           type: string
 *           description: The image of user.
 *         presence:
 *           type: boolean
 *           description: The status of user login or not
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date of the record creation.
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date of the record update.
 */

/**
 *  @swagger
 * tags:
 *   name: Users
 *   description: API to manage users.
 */

/**
 * @swagger
 * paths:
 *   /user/auth/:
 *     get:
 *       summary: status of user login
 *       tags: [Users]
 *       responses:
 *         "200":
 *           description: The created chat.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *   /user/register/:
 *     post:
 *       summary: register user
 *       tags: [Users]
 *       requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  email: 
 *                    type: string
 *                  password:
 *                    type: string
 *                  nickname:
 *                    type: string
 *                  image:
 *                    type: string
 *                required:
 *                  - nickname
 *                  - email
 *                  - password
 *                  - image
 *       responses:
 *         "200":
 *           description: The created chat.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *   /user/login/:
 *     post:
 *       summary: login user
 *       tags: [Users]
 *       requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  email: 
 *                    type: string
 *                  password:
 *                    type: string
 *                required:
 *                  - email
 *                  - password
 *       responses:
 *         "200":
 *           description: The created chat.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *   /user/logout/:
 *     patch:
 *       summary: logout user
 *       tags: [Users]
 *       responses:
 *         "200":
 *           description: The created chat.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 */

const express = require('express');
const router = express.Router();
const path = require('path')

const { auth } = require('../middleware/auth')
const { User } = require('../models/User')

const multer = require('multer')
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk')

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2'
})
const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'slack.shinywaterjeong',
    key(req, file, callback) {
      callback(null, `user/${Date.now()}_${path.basename(file.originalname)}`)
    }
  }),
  limits: { fileSize: 6 * 1024 * 1024 },  // 6MB
})

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
          if (process.env.NODE_ENV === 'production') {
            return res.cookie('slack_auth', token, {
              domain: '.shinywaterjeong.com',
              sameSite: 'none',
              secure: true,
              httpOnly: true,
            }).status(200).json({ user: fullUser })
          } else {
            return res.cookie('slack_auth', token).status(200).json({ user: fullUser })
          }
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
      return res.cookie('slack_auth', '').status(200).json({ user: {} });
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

router.post('/image', auth, upload.single('image'), (req, res) => {
  const imageUrl = req.file.location;

  User.findOneAndUpdate({ _id: req.user._id },
    { image: imageUrl },
    (error, user) => {
      if (error) {
        console.error(error);
        return res.status(400).json({ message: '사진을 저장하는 과정에서 문제가 발생했습니다.', error })
      }
      return res.status(200).json({ image: imageUrl, userId: req.user._id })
    })
})

module.exports = router