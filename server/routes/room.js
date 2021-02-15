/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       required:
 *         - writer
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated _id of the room.
 *         starred:
 *           type: array
 *             items:{}
 *         typing:
 *           type: array
 *             items:{}
 *         title:
 *           type: string
 *           description: The title of room.
 *         description:
 *           type: string
 *           description: The description of room.
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
 *   name: Rooms
 *   description: API to manage rooms.
 */

/**
 * @swagger
 * paths:
 *   /room/rooms/:
 *     get:
 *       summary: array of rooms
 *       tags: [Rooms]
 *       responses:
 *         "200":
 *           description: The created room.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Room'
 */

const express = require('express');
const router = express.Router();

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