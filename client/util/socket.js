import io from 'socket.io-client';
import config from '../config/config';
const env = process.env.NODE_ENV || 'development';
const { SERVER_URL } = config[env];

let socket;

export const initiateSocket = () => {
  socket = io(SERVER_URL, { withCredentials: true });
}
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
}
export const detectError = () => {
  if (socket) socket.on('SocketError', error => {
    console.error(error);
  });
}

export const sendChat = (data) => {
  if (socket) {
    socket.emit('submitMessage', data);
  }
}
export const subscribeChat = (callback) => {
  if (socket) socket.on('returnMessage', data => {
    if (data.error) return callback(data);
    return callback(null, data);
  });
}

export const createRoom = (data) => {
  if (socket) {
    socket.emit('createRoom', data)
  }
}
export const subscribeRoom = (callback) => {
  if (socket) socket.on('returnRoom', data => {
    if (data.error) return callback(data);
    return callback(null, data);
  });
}

export const createDirect = (data) => {
  if (socket) {
    socket.emit('createDirect', data)
  }
}
export const subscribeDirect = (callback) => {
  if (socket) socket.on('returnDirect', data => {
    if (data.error) return callback(data);
    return callback(null, data);
  });
}

export const sendPresence = (data) => {
  if (socket) {
    socket.emit('submitPresence', data)
  }
}
export const subscribePresence = (callback) => {
  if (socket) socket.on('returnPresence', data => {
    if (data.error) return callback(data);
    return callback(null, data);
  });
}

export const sendAbsence = (data) => {
  if (socket) {
    socket.emit('submitAbsence', data)
  }
}
export const subscribeAbsence = (callback) => {
  if (socket) socket.on('returnAbsence', data => {
    if (data.error) return callback(data);
    return callback(null, data);
  });
}

export const sendTypingStart = (data) => {
  if (socket) {
    socket.emit('submitTypingStart', data)
  }
}
export const subscribeTypingStart = (callback) => {
  if (socket) socket.on('returnTypingStart', data => {
    if (data.error) return callback(data);
    return callback(null, data);
  });
}

export const sendTypingFinish = (data) => {
  if (socket) {
    socket.emit('submitTypingFinish', data)
  }
}
export const subscribeTypingFinish = (callback) => {
  if (socket) socket.on('returnTypingFinish', data => {
    if (data.error) return callback(data);
    return callback(null, data);
  });
}
