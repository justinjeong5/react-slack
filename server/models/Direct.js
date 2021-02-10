const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const directSchema = mongoose.Schema({
  user1: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  user2: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  starred: {
    type: Array,
    default: [],
  },
  typing: {
    type: Array,
    default: [],
  },
}, { timestamps: true })

const Direct = mongoose.model('Direct', directSchema)

module.exports = { Direct }