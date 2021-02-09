import produce from 'immer'
import {
  LOAD_ROOMS_REQUEST, LOAD_ROOMS_SUCCESS, LOAD_ROOMS_FAILURE,
  CREATE_ROOM_REQUEST, CREATE_ROOM_SUCCESS, CREATE_ROOM_FAILURE,
  GET_CURRENT_ROOM,
  ADD_STARRED, REMOVE_STARRED,
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
        draft.roomList = action.data.rooms;
        draft.currentRoom = action.data.rooms[0] || {};
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
        draft.roomList.push(action.data.room)
        draft.currentRoom = action.data.room;
        draft.createRoomLoading = false;
        draft.createRoomDone = true;
        break;
      case CREATE_ROOM_FAILURE:
        draft.createRoomLoading = false;
        draft.createRoomError = action.error;
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
      default:
        break;
    }
  })
}

export default roomReducer;