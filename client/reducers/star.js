import produce from 'immer'
import {
  ADD_STAR_REQUEST, ADD_STAR_SUCCESS, ADD_STAR_FAILURE,
} from './types'

const initialState = {
  starList: [],

  addStarDone: false,
  addStarLoading: false,
  addStarError: null,
}

const StarReducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case ADD_STAR_REQUEST:
        draft.addStarLoading = true;
        draft.addStarDone = false;
        draft.addStarError = null;
        break;
      case ADD_STAR_SUCCESS:
        draft.starList.unshift(action.data.room);
        draft.addStarLoading = false;
        draft.addStarDone = true;
        break;
      case ADD_STAR_FAILURE:
        draft.addStarLoading = false;
        draft.addStarError = action.error;
        break;
      default:
        break;
    }
  })
}

export default StarReducer;