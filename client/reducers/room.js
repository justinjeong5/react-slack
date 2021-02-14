import produce from 'immer'
import {
  LOAD_ROOMS_REQUEST, LOAD_ROOMS_SUCCESS, LOAD_ROOMS_FAILURE,
  CREATE_ROOM_SUBSCRIBE, CREATE_ROOM_SUCCESS, CREATE_ROOM_FAILURE,
  TYPING_START_SUBSCRIBE, TYPING_START_SUCCESS, TYPING_START_FAILURE,
  TYPING_FINISH_SUBSCRIBE, TYPING_FINISH_SUCCESS, TYPING_FINISH_FAILURE,
  GET_CURRENT_ROOM,
  ADD_STARRED, REMOVE_STARRED,
  SET_USER_IMAGE_SUCCESS,
} from './types'

const initialState = {
  roomList: [],
  currentRoom: {},

  loadRoomsDone: false,
  loadRoomsLoading: false,
  loadRoomsError: null,
  createRoomDone: false,
  createRoomLoading: false,
  createRoomError: null,
  typingStartLoading: false,
  typingStartDone: false,
  typingStartError: null,
  typingFinishLoading: false,
  typingFinishDone: false,
  typingFinishError: null,
}

const roomReducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LOAD_ROOMS_REQUEST:
        draft.loadRoomsLoading = true;
        draft.loadRoomsDone = false;
        draft.loadRoomsError = null;
        break;
      case LOAD_ROOMS_SUCCESS:
        draft.roomList = action.data.rooms;
        draft.currentRoom = action.data.rooms[0] || {};
        draft.loadRoomsLoading = false;
        draft.loadRoomsDone = true;
        break;
      case LOAD_ROOMS_FAILURE:
        draft.loadRoomsLoading = false;
        draft.loadRoomsError = action.error;
        break;
      case CREATE_ROOM_SUBSCRIBE:
        draft.createRoomLoading = true;
        draft.createRoomDone = false;
        draft.createRoomError = null;
        break;
      case CREATE_ROOM_SUCCESS:
        draft.roomList.push(action.data.room)
        draft.createRoomLoading = false;
        draft.createRoomDone = true;
        break;
      case CREATE_ROOM_FAILURE:
        draft.createRoomLoading = false;
        draft.createRoomError = action.error;
        break;
      case TYPING_START_SUBSCRIBE:
        draft.typingStartLoading = true;
        draft.typingStartDone = false;
        draft.typingStartError = null;
        break;
      case TYPING_START_SUCCESS: {
        if (draft.currentRoom._id === action.data.room) {
          const currentIndex = draft.currentRoom.typing.findIndex(cur => cur?.userId === action.data.user.userId);
          if (currentIndex === -1) {
            draft.currentRoom.typing.push(action.data.user)
          }
        }
        draft.typingStartLoading = false;
        draft.typingStartDone = true;
        break;
      }
      case TYPING_START_FAILURE:
        draft.typingStartLoading = false;
        draft.typingStartError = action.error;
        break;
      case TYPING_FINISH_SUBSCRIBE:
        draft.typingFisnishLoading = true;
        draft.typingFisnishDone = false;
        draft.typingFisnishError = null;
        break;
      case TYPING_FINISH_SUCCESS: {
        if (draft.currentRoom._id === action.data.room) {
          const currentIndex = draft.currentRoom.typing.findIndex(cur => cur.userId === action.data.userId);
          if (currentIndex !== -1) {
            draft.currentRoom.typing.splice(currentIndex, 1)
          }
        }
        draft.typingFisnishLoading = false;
        draft.typingFisnishDone = true;
        break;
      }
      case TYPING_FINISH_FAILURE:
        draft.typingFisnishLoading = false;
        draft.typingFisnishError = action.error;
        break;
      case GET_CURRENT_ROOM:
        draft.currentRoom = action.data.room;
        break;
      case ADD_STARRED:
      case REMOVE_STARRED:
        const directIndex = draft.roomList.findIndex(room => room._id === action.data.star._id);
        if (directIndex !== -1) {
          draft.roomList[directIndex].starred = action.data.star.starred;
        }
        draft.currentRoom.starred = action.data.star.starred;
        break;
      case SET_USER_IMAGE_SUCCESS:
        if (draft.currentRoom.writer._id === action.data.userId) {
          draft.currentRoom.writer.image = action.data.image
        }
        draft.roomList = draft.roomList.map(room => {
          if (room.writer._id === action.data.userId) {
            room.writer.image = action.data.image
          }
          return room;
        })
        break;
      default:
        break;
    }
  })
}

export default roomReducer;