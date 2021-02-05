import produce from 'immer'
import {
  LOAD_ROOMS_REQUEST, LOAD_ROOMS_SUCCESS, LOAD_ROOMS_FAILURE,
  CREATE_ROOM_REQUEST, CREATE_ROOM_SUCCESS, CREATE_ROOM_FAILURE,
  GET_CURRENT_ROOM,
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
        if (action.data.room) {
          draft.roomList.unshift(action.data.room);
          if (!draft.currentRoom.id) {
            draft.currentRoom = action.data.room;
          }
        }
        draft.loadRoomsLoading = false;
        draft.loadRoomsDone = true;
        break;
      case LOAD_ROOMS_FAILURE:
        draft.loadRoomsLoading = false;
        draft.loadRoomsError = action.error;
        break;
      case CREATE_ROOM_REQUEST:
        draft.createRoomLoading = true;
        draft.createRoomDone = false;
        draft.createRoomError = null;
        break;
      case CREATE_ROOM_SUCCESS:
        draft.currentRoom = action.data.room;
        draft.createRoomLoading = false;
        draft.createRoomDone = true;
        break;
      case CREATE_ROOM_FAILURE:
        draft.createRoomLoading = false;
        draft.createRoomError = action.error;
        break;
      case GET_CURRENT_ROOM:
        if (action.data.room.title) {
          draft.currentRoom = action.data.room;
        } else {
          draft.currentRoom = {
            id: action.data.room.uid,
            title: action.data.room.nickname,
            description: `${action.data.room.nickname}님과 대화하세요!`,
            writer: action.data.room,
          }
        }
        break;
      default:
        break;
    }
  })
}

export default roomReducer;