import produce from 'immer'
import {
  SOCKET_CONNECT, SOCKET_DISCONNECT,
} from './types'

const initialState = {
  socketConnection: false,
}

const socketReducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case SOCKET_CONNECT:
        draft.socketConnection = true;
        break;
      case SOCKET_DISCONNECT:
        draft.socketConnection = false;
        break;
      default:
        break;
    }
  })
}

export default socketReducer;