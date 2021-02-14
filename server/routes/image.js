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