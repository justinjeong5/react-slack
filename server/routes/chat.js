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
 *           type: string
 *           description: The auto-generated _id of the chat.
 *         content:
 *           type: string
 *           description: The content of chat.
 *         writer:
 *           type: object
 *           properties:
 *            _id: 
 *              type: string
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
 *       tags: [Chats]
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