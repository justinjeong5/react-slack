const { User } = require("../models/User");

const auth = (req, res, next) => {
  let token = req.cookies[process.env.COOKIE_NAME];
  if (!token) {
    return res.status(400).json({ message: '로그인 되지 않은 사용자입니다.' })
  }

  User.findByToken(token, (error, user) => {
    if (error) {
      console.error(error)
      return res.status(400).json({ message: '사용자 인증과정에서 문제가 발생했습니다.', error })
    }
    if (!user) {
      return res.status(400).json({ message: '존재하지 않는 사용자입니다.' })
    }
    req.token = token;
    req.user = user;
    next();
  })
}

module.exports = { auth }
