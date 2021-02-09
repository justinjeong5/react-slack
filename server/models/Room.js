const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = mongoose.Schema({
  writer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  starred: {
    type: Array,
    default: [],
  },
}, { timestamps: true })

const Room = mongoose.model('Room', roomSchema)

module.exports = { Room }