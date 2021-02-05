import { HYDRATE } from 'next-redux-wrapper'
import { combineReducers } from 'redux'

import user from './user'
import room from './room'
import chat from './chat'
import users from './users'
import image from './image'
import star from './star'


const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        user,
        room,
        chat,
        users,
        image,
        star,
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;