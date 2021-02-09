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