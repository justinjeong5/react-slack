const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan')
const mongoose = require('mongoose')

const app = express();
dotenv.config();
mongoose.connect(process.env.MONGO_URI, {
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
app.listen(port, () => {
  console.log(`server is listening on port ${port}`)
})
