import produce from 'immer'
import {
  LOAD_CHATS_REQUEST, LOAD_CHATS_SUCCESS, LOAD_CHATS_FAILURE,
  SEND_CHAT_SUBSCRIBE, SEND_CHAT_SUCCESS, SEND_CHAT_FAILURE,
  GET_CHATS_OF_ROOM, GET_CURRENT_ROOM, SET_USER_IMAGE_SUCCESS,
} from './types'

const initialState = {
  chatList: [],
  currentChats: [],

  readCount: {},
  currentRoomId: null,

  sendChatDone: false,
  sendChatLoading: false,
  sendChatError: null,
  loadChatsDone: false,
  loadChatsLoading: false,
  loadChatsError: null,
}

const chatReducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LOAD_CHATS_REQUEST:
        draft.loadChatsLoading = true;
        draft.loadChatsDone = false;
        draft.loadChatsError = null;
        break;
      case LOAD_CHATS_SUCCESS:
        action.data.chats.forEach(chat => {
          if (!draft.readCount[chat.room]) {
            draft.readCount[chat.room] = { read: 0, count: 0 }
          }
          draft.readCount[chat.room].read++;
          draft.readCount[chat.room].count++;
        })
        draft.chatList = action.data.chats;
        draft.loadChatsLoading = false;
        draft.loadChatsDone = true;
        break;
      case LOAD_CHATS_FAILURE:
        draft.loadChatsLoading = false;
        draft.loadChatsError = action.error;
        break;
      case SEND_CHAT_SUBSCRIBE:
        draft.sendChatLoading = true;
        draft.sendChatDone = false;
        draft.sendChatError = null;
        break;
      case SEND_CHAT_SUCCESS:
        draft.chatList.push(action.data.chat)
        if (!draft.readCount[action.data.chat.room]) {
          draft.readCount[action.data.chat.room] = { read: 0, count: 0 }
        }
        draft.readCount[action.data.chat.room].count++;
        if (draft.currentRoomId === action.data.chat.room) {
          draft.currentChats.push(action.data.chat)
          draft.readCount[action.data.chat.room].read++;
        }
        draft.sendChatLoading = false;
        draft.sendChatDone = true;
        break;
      case SEND_CHAT_FAILURE:
        draft.sendChatLoading = false;
        draft.sendChatError = action.error;
        break;
      case GET_CHATS_OF_ROOM:
        if (!draft.readCount[action.data.roomId]) {
          draft.readCount[action.data.roomId] = { read: 0, count: 0 }
        } else {
          draft.readCount[action.data.roomId].read = draft.readCount[action.data.roomId].count;
        }
        draft.currentChats = draft.chatList.filter(chat =>
          chat.room === action.data.roomId
        )
        break;
      case GET_CURRENT_ROOM:
        draft.currentRoomId = action.data.room._id;
        break;
      case SET_USER_IMAGE_SUCCESS:
        draft.chatList = draft.chatList.map(chat => {
          if (chat.writer._id === action.data.userId) {
            chat.writer.image = action.data.image
          }
          return chat;
        });
        draft.currentChats = draft.currentChats.map(chat => {
          if (chat.writer._id === action.data.userId) {
            chat.writer.image = action.data.image
          }
          return chat;
        });
        break;
      default:
        break;
    }
  })
}

export default chatReducer;