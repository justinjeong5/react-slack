const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan')

const app = express();

const { Chat } = require('./models/Chat')
const { Room } = require('./models/Room')
const { Direct } = require('./models/Direct')

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: true,
    credentials: true
  }
})

dotenv.config();
const mongoose = require('mongoose')
const connect = mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}).then(() => {
  console.log('successfully connected to database')
}).catch((error) => {
  console.error(error)
})

app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true,
}));

io.on('connection', (socket) => {
  socket.on('submitMessage', (data) => {
    connect.then(database => {
      const chat = new Chat(data);
      chat.save((error, doc) => {
        if (error) {
          console.error(error);
          return io.emit('SocketError', { message: '채팅을 저장하는 과정에서 문제가 발생했습니다.', error })
        }
        Chat.findOne({ '_id': doc._doc._id })
          .populate('writer')
          .exec((error, chat) => {
            if (error) {
              console.error(error);
              return io.emit('SocketError', { message: '채팅을 불러오는 과정에서 문제가 발생했습니다.', error })
            }
            const fullChat = chat.toJSON();
            delete fullChat.writer.password;
            delete fullChat.writer.token;

            return io.emit('returnMessage', { chat: fullChat })
          })
      })
    })
  })

  socket.on('createRoom', (data) => {
    connect.then(database => {
      const room = new Room(data);
      room.save((error, doc) => {
        if (error) {
          console.error(error);
          return io.emit('SocketError', { message: '방을 생성하는 과정에서 문제가 발생했습니다.', error })
        }
        Room.findOne({ '_id': doc._doc._id })
          .populate('writer')
          .exec((error, room) => {
            if (error) {
              console.error(error);
              return io.emit('SocketError', { message: '생성한 방 정보를 얻는 과정에서 문제가 발생했습니다.', error })
            }
            const fullRoom = room.toJSON();
            delete fullRoom.writer.password;
            delete fullRoom.writer.token;
            return io.emit('returnRoom', { room: fullRoom })
          })
      })
    })
  })

  socket.on('createDirect', (data) => {
    connect.then(database => {
      const direct = new Direct(data);
      direct.save((error, doc) => {
        if (error) {
          console.error(error);
          return io.emit('SocketError', { message: 'DM을 저장하는 과정에서 문제가 발생했습니다.', error })
        }
        Direct.findOne({ '_id': doc._doc._id })
          .populate('user1')
          .populate('user2')
          .exec((error, direct) => {
            if (error) {
              console.error(error);
              return io.emit('SocketError', { message: 'DM 정보를 불러오는 과정에서 문제가 발생했습니다.', error })
            }
            const fullDirect = direct.toJSON();
            delete fullDirect.user1.password;
            delete fullDirect.user1.token;
            delete fullDirect.user2.password;
            delete fullDirect.user2.token;
            return io.emit('returnDirect', { direct: fullDirect })
          })
      })
    })
  })
})


app.use('/chat', require('./routes/chat'))
app.use('/direct', require('./routes/direct'))
app.use('/image', require('./routes/image'))
app.use('/room', require('./routes/room'))
app.use('/star', require('./routes/star'))
app.use('/user', require('./routes/user'))


app.get('/', (req, res) => {
  res.send('successfully connected server-side app')
})

const port = process.env.PORT || 3065;
server.listen(port, () => {
  console.log(`server is listening on port ${port}`)
})
