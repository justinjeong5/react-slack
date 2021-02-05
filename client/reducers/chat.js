import produce from 'immer'
import {
  LOAD_CHATS_REQUEST, LOAD_CHATS_SUCCESS, LOAD_CHATS_FAILURE,
  SEND_CHAT_REQUEST, SEND_CHAT_SUCCESS, SEND_CHAT_FAILURE,
  GET_CHATS_OF_ROOM,
} from './types'

const initialState = {
  chatList: [],
  currentChats: [],

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
        draft.chatList.unshift(action.data.chat);
        draft.loadChatsLoading = false;
        draft.loadChatsDone = true;
        break;
      case LOAD_CHATS_FAILURE:
        draft.loadChatsLoading = false;
        draft.loadChatsError = action.error;
        break;
      case SEND_CHAT_REQUEST:
        draft.sendChatLoading = true;
        draft.sendChatDone = false;
        draft.sendChatError = null;
        break;
      case SEND_CHAT_SUCCESS:
        draft.sendChatLoading = false;
        draft.sendChatDone = true;
        break;
      case SEND_CHAT_FAILURE:
        draft.sendChatLoading = false;
        draft.sendChatError = action.error;
        break;
      case GET_CHATS_OF_ROOM:
        draft.currentChats = draft.chatList.filter(chat => (
          chat.id === action.data.roomId
        ))
        break;
      default:
        break;
    }
  })
}

export default chatReducer;