import produce from 'immer'
import {
  LOAD_USERS_REQUEST, LOAD_USERS_SUCCESS, LOAD_USERS_FAILURE,
} from './types'

const initialState = {
  userList: [],

  loadUsersDone: false,
  loadUsersLoading: false,
  loadUsersError: null,
}

const usersReducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LOAD_USERS_REQUEST:
        draft.loadUsersLoading = true;
        draft.loadUsersDone = false;
        draft.loadUsersError = null;
        break;
      case LOAD_USERS_SUCCESS:
        draft.userList.unshift(action.data.user);
        draft.loadUsersLoading = false;
        draft.loadUsersDone = true;
        break;
      case LOAD_USERS_FAILURE:
        draft.loadUsersLoading = false;
        draft.loadUsersError = action.error;
        break;
      default:
        break;
    }
  })
}

export default usersReducer;