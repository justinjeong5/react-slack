import { HYDRATE } from 'next-redux-wrapper'
import { combineReducers } from 'redux'

import user from './user'
import room from './room'
import direct from './direct'
import chat from './chat'
import image from './image'
import star from './star'
import socket from './socket'


const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        user,
        room,
        direct,
        chat,
        image,
        star,
        socket,
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;