/**
 * @swagger
 * components:
 *   schemas:
 *     Image:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated _id of the image.
 *         image:
 *           type: object
 *           properties:
 *             src:
 *               type: string
 *           description: The image of the image
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
 *   name: Images
 *   description: API to manage images.
 */

/**
 * @swagger
 * paths:
 *   /image/:
 *     post:
 *       summary: upload of image
 *       tags: [Images]
 *       requestBody:
 *          required: true
 *          content:
 *            application/x-www-form-urlencoded:
 *              schema:
 *                type: object
 *                properties:
 *                  warning: 
 *                    type: string
 *                    description: this is multipart form
 *       responses:
 *         "200":
 *           description: The created image.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Image'
 */


const express = require('express');
const router = express.Router();
const path = require('path')

const { auth } = require('../middleware/auth')

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
      callback(null, `original/${Date.now()}_${path.basename(file.originalname)}`)
    }
  }),
  limits: { fileSize: 6 * 1024 * 1024 },  // 6MB
})

router.post('/', auth, upload.single('image'), (req, res) => {
  const image = { src: req.file.location };

  return res.status(201).json({ image })
})

module.exports = router