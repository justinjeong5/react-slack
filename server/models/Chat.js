const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = mongoose.Schema({
  writer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  room: {
    type: String,
  },
  content: {
    type: String,
  },
  image: {
    type: String,
  },
}, { timestamps: true })

const Chat = mongoose.model('Chat', chatSchema)

module.exports = { Chat }