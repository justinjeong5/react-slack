import produce from 'immer'
import {
  ADD_STAR_REQUEST, ADD_STAR_SUCCESS, ADD_STAR_FAILURE,
  REMOVE_STAR_REQUEST, REMOVE_STAR_SUCCESS, REMOVE_STAR_FAILURE,
  LOAD_STARS_REQUEST, LOAD_STARS_SUCCESS, LOAD_STARS_FAILURE,
  RESET_STAR_STORE,
} from './types'
import { userParser } from './direct'

const initialState = {
  starList: [],

  addStarDone: false,
  addStarLoading: false,
  addStarError: null,
  removeStarDone: false,
  removeStarLoading: false,
  removeStarError: null,
  loadStarsDone: false,
  loadStarsLoading: false,
  loadStarsError: null,
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
        if (action.data.star.user1) {
          const direct = userParser(action.data.star, action.data.userId)
          draft.starList.push(direct);
        } else {
          draft.starList.push(action.data.star);
        }
        draft.addStarLoading = false;
        draft.addStarDone = true;
        break;
      case ADD_STAR_FAILURE:
        draft.addStarLoading = false;
        draft.addStarError = action.error;
        break;
      case REMOVE_STAR_REQUEST:
        draft.removeStarLoading = true;
        draft.removeStarDone = false;
        draft.removeStarError = null;
        break;
      case REMOVE_STAR_SUCCESS:
        const starIndex = draft.starList.findIndex(star => star._id === action.data.star._id);
        draft.starList.splice(starIndex, 1);
        draft.removeStarLoading = false;
        draft.removeStarDone = true;
        break;
      case REMOVE_STAR_FAILURE:
        draft.removeStarLoading = false;
        draft.removeStarError = action.error;
        break;
      case LOAD_STARS_REQUEST:
        draft.loadStarsLoading = true;
        draft.loadStarsDone = false;
        draft.loadStarsError = null;
        break;
      case LOAD_STARS_SUCCESS:
        const directs = action.data.directs.map(direct => userParser(direct, action.data.userId));
        draft.starList.push(...directs);
        draft.starList.push(...action.data.rooms);
        draft.loadStarsLoading = false;
        draft.loadStarsDone = true;
        break;
      case LOAD_STARS_FAILURE:
        draft.loadStarsLoading = false;
        draft.loadStarsError = action.error;
        break;
      case RESET_STAR_STORE:
        draft.starList = [];
        break;
      default:
        break;
    }
  })
}

export default StarReducer;