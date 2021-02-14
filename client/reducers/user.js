import produce from 'immer'
import {
  AUTH_USER_REQUEST, AUTH_USER_SUCCESS, AUTH_USER_FAILURE,
  REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS, REGISTER_USER_FAILURE,
  LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE,
  LOGOUT_USER_REQUEST, LOGOUT_USER_SUCCESS, LOGOUT_USER_FAILURE,
  SET_USER_IMAGE_REQUEST, SET_USER_IMAGE_SUCCESS, SET_USER_IMAGE_FAILURE,
  RESET_USER_STORE,
} from './types'

const initialState = {
  currentUser: {},

  authUserDone: false,
  authUserLoading: false,
  authUserError: null,
  registerUserDone: false,
  registerUserLoading: false,
  registerUserError: null,
  loginUserDone: false,
  loginUserLoading: false,
  loginUserError: null,
  logoutUserDone: false,
  logoutUserLoading: false,
  logoutUserError: null,
  setUserImageDone: false,
  setUserImageLoading: false,
  setUserImageError: null,
}

const userReducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case AUTH_USER_REQUEST:
        draft.authUserLoading = true;
        draft.authUserDone = false;
        draft.authUserError = null;
        break;
      case AUTH_USER_SUCCESS:
        draft.currentUser = action.data.user;
        draft.authUserLoading = false;
        draft.authUserDone = true;
        break;
      case AUTH_USER_FAILURE:
        draft.authUserLoading = false;
        draft.authUserError = action.error;
        break;
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
      case SET_USER_IMAGE_REQUEST:
        draft.setUserImageLoading = true;
        draft.setUserImageDone = false;
        draft.setUserImageError = null;
        break;
      case SET_USER_IMAGE_SUCCESS:
        draft.currentUser.image = action.data.image;
        draft.setUserImageLoading = false;
        draft.setUserImageDone = true;
        break;
      case SET_USER_IMAGE_FAILURE:
        draft.setUserImageLoading = false;
        draft.setUserImageError = action.error;
        break;
      case RESET_USER_STORE:
        draft.loginUserDone = false;
        break;
      default:
        break;
    }
  })
}

export default userReducer;