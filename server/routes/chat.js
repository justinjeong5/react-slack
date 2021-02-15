/**
 * @swagger
 * components:
 *   schemas:
 *     Chat:
 *       type: object
 *       required:
 *         - writer
 *       properties:
 *         _id:
 *           type: mongoose.Scheme.Type.ObjectId
 *           description: The auto-generated _id of the chat.
 *         content:
 *           type: string
 *           description: The content of chat.
 *         writer:
 *           type: object
 *           properties:
 *            _id: 
 *              type: mongoose.Scheme.Type.ObjectId
 *            email:
 *              type: string
 *            nickname:
 *              type: string
 *            image:
 *              type: string
 *            createdAt:
 *              type: string
 *              format: date
 *            updatedAt:
 *              type: string
 *              format: date
 *            presence:
 *              type: boolean
 *         image:
 *           type: string
 *           description: The image of the chat
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date of the record creation.
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date of the record update.
 *       example:
 *        chats: [
 *          {
 *            _id: 60224da5fea88f490a15fd71,
 *            room: 60224d9bfea88f490a15fd70,
 *            content: 안녕하세요,
 *            writer: {
 *              presence: true,
 *              _id: 60224cf2fea88f490a15fd6c,
 *              email: 1@gmail.com,
 *              nickname: Test01,
 *              image: https://s3.ap-northeast-2.amazonaws.com/slack.shinywaterjeong/user/1613310776360_42F931B1-A49E-4B5A-BF20-1E1B51A36E2A.jpeg,
 *              createdAt: 2021-02-09T08:50:58.359Z,
 *              updatedAt: 2021-02-15T09:27:28.520Z,
 *            },
 *            createdAt: 2021-02-09T08:53:57.057Z,
 *            updatedAt: 2021-02-09T08:53:57.057Z,
 *          },
 *          {
 *            _id: 60224dc5fea88f490a15fd72,
 *            room: 60224d9bfea88f490a15fd70,
 *            content: 안녕,
 *            writer: {
 *              presence: false,
 *              _id: 60224d01fea88f490a15fd6d,
 *              email: 2@gmail.com,
 *              nickname: Test02,
 *              image: https://gravatar.com/avatar/a5d031bfdd273de633518982d7283537?d=identicon,
 *              createdAt: 2021-02-09T08:51:13.048Z,
 *              updatedAt: 2021-02-14T07:57:39.477Z,
 *            },
 *            createdAt: 2021-02-09T08:54:29.024Z,
 *            updatedAt: 2021-02-09T08:54:29.024Z,
 *          },
 *          {
 *            _id: 60224dd4fea88f490a15fd73,
 *            room: 60224d07fea88f490a15fd6e,
 *            content: 반가워요,
 *            writer: {
 *              presence: true,
 *              _id: 60224cf2fea88f490a15fd6c,
 *              email: 1@gmail.com,
 *              nickname: Test01,
 *              image: https://s3.ap-northeast-2.amazonaws.com/slack.shinywaterjeong/user/1613310776360_42F931B1-A49E-4B5A-BF20-1E1B51A36E2A.jpeg,
 *              createdAt: 2021-02-09T08:50:58.359Z,
 *              updatedAt: 2021-02-15T09:27:28.520Z,
 *            },
 *            createdAt: 2021-02-09T08:54:44.862Z,
 *            updatedAt: 2021-02-09T08:54:44.862Z,
 *          }]
 */

/**
 *  @swagger
 * tags:
 *   name: Chats
 *   description: API to manage chats.
 */

/**
 * @swagger
 * paths:
 *   /chat/chats/:
 *     get:
 *       summary: array of chats
 *       tags: [chats]
 *       responses:
 *         "200":
 *           description: The created chat.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Chat'
 */

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