/**
 * @swagger
 * components:
 *   schemas:
 *     Direct:
 *       type: object
 *       required:
 *         - user1
 *         - user2
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated _id of the direct.
 *         starred:
 *           type: array
 *             items:{}
 *         typing:
 *           type: array
 *             items:{}
 *         user1:
 *           type: object
 *           properties:
 *             _id: 
 *               type: string
 *             email:
 *               type: string
 *             nickname:
 *               type: string
 *             image:
 *               type: string
 *             createdAt:
 *               type: string
 *               format: date
 *             updatedAt:
 *               type: string
 *               format: date
 *             presence:
 *               type: boolean
 *         user2:
 *          type: object
 *          properties:
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
 *   name: Directs
 *   description: API to manage directs.
 */

/**
 * @swagger
 * paths:
 *   /direct/directs/:
 *     get:
 *       summary: array of directs
 *       tags: [Directs]
 *       responses:
 *         "200":
 *           description: The created direct.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Direct'
 */

const express = require('express');
const router = express.Router();

const { auth } = require('../middleware/auth')
const { Direct } = require('../models/Direct')

router.get('/directs', auth, (req, res) => {
  Direct.find({ $or: [{ user1: req.user._id }, { user2: req.user._id }] })
    .populate('user1')
    .populate('user2')
    .exec((error, directs) => {
      if (error) {
        console.error(error);
        return res.status(400).json({ message: 'DM 정보를 불러오는 과정에서 문제가 발생했습니다.', error })
      }
      const fullDirects = directs.map(direct => {
        const fullDirect = direct.toJSON();
        delete fullDirect.user1.password;
        delete fullDirect.user1.token;
        delete fullDirect.user2.password;
        delete fullDirect.user2.token;
        return fullDirect;
      })
      return res.status(200).json({ directs: fullDirects, userId: req.user._id })
    })
})

module.exports = router