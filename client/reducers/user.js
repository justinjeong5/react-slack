import produce from 'immer'
import {
  REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS, REGISTER_USER_FAILURE,
  LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE,
  LOGOUT_USER_REQUEST, LOGOUT_USER_SUCCESS, LOGOUT_USER_FAILURE,
  CHANGE_USER_IMAGE,
  RESET_USER_STORE,
} from './types'

const initialState = {
  currentUser: {},

  registerUserDone: false,
  registerUserLoading: false,
  registerUserError: null,
  loginUserDone: false,
  loginUserLoading: false,
  loginUserError: null,
  logoutUserDone: false,
  logoutUserLoading: false,
  logoutUserError: null,
}

const userReducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case REGISTER_USER_REQUEST:
        draft.registerUserLoading = true;
        draft.registerUserDone = false;
        draft.registerUserError = null;
        break;
      case REGISTER_USER_SUCCESS:
        draft.currentUser = action.data.user;
        draft.registerUserLoading = false;
        draft.registerUserDone = true;
        break;
      case REGISTER_USER_FAILURE:
        draft.registerUserLoading = false;
        draft.registerUserError = action.error;
        break;
      case LOGIN_USER_REQUEST:
        draft.loginUserLoading = true;
        draft.loginUserDone = false;
        draft.loginUserError = null;
        break;
      case LOGIN_USER_SUCCESS:
        draft.currentUser = action.data.user;
        draft.loginUserLoading = false;
        draft.loginUserDone = true;
        break;
      case LOGIN_USER_FAILURE:
        draft.loginUserLoading = false;
        draft.loginUserError = action.error;
        break;
      case LOGOUT_USER_REQUEST:
        draft.loginUserDone = false;
        draft.registerUserDone = false;
        draft.logoutUserLoading = true;
        draft.logoutUserDone = false;
        draft.logoutUserError = null;
        break;
      case LOGOUT_USER_SUCCESS:
        draft.currentUser = {};
        draft.logoutUserLoading = false;
        draft.logoutUserDone = true;
        break;
      case LOGOUT_USER_FAILURE:
        draft.logoutUserLoading = false;
        draft.logoutUserError = action.error;
        break;
      case CHANGE_USER_IMAGE:
        draft.currentUser.image = action.data.image;
        break;
      case RESET_USER_STORE:
        draft.loginUserDone = false;
      default:
        break;
    }
  })
}

export default userReducer;