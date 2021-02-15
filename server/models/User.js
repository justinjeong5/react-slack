const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
  nickname: {
    type: String,
    maxLength: 50,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minLength: 6,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  presence: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true })


//============================================
//                  bcryptjs
//============================================
userSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, function (error, salt) {
      if (error) {
        console.error(error)
        return next(error);
      }
      bcrypt.hash(user.password, salt, function (error, hash) {
        if (error) {
          console.error(error)
          return next(error);
        }
        user.password = hash;
        next()
      });
    });
  } else {
    next()
  }
})

userSchema.methods.comparePassword = function (plainPassword, callback) {
  var user = this;
  bcrypt.compare(plainPassword, user.password, function (error, isMatch) {
    if (error) {
      console.error(error)
      return callback(error);
    }
    callback(null, isMatch);
  })
}

//============================================
//               jsonWebToken
//============================================
userSchema.methods.generateToken = function (callback) {
  var user = this;
  var token = jwt.sign({
    data: user._id.toHexString()
  }, process.env.SECRET_OR_PRIVATE_KEY);
  user.token = token;
  user.save(function (error, user) {
    if (error) {
      console.error(error)
      return callback(error);
    }
    callback(null, user);
  })
}

userSchema.statics.findByToken = function (token, callback) {
  var user = this;
  jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY, function (error, decoded) {
    if (error) {
      console.error(error)
      return callback(error);
    }
    user.findOne({
      "_id": decoded.data,
      "token": token
    }, function (error, user) {
      if (error) {
        console.error(error)
        return callback(error);
      }
      callback(null, user);
    })
  })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }