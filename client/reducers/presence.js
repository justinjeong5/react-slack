import produce from 'immer'
import {
  LOAD_PRESENCES_REQUEST, LOAD_PRESENCES_SUCCESS, LOAD_PRESENCES_FAILURE,
  PRESENCE_USER_SUBSCRIBE, PRESENCE_USER_SUCCESS, PRESENCE_USER_FAILURE,
  ABSENCE_USER_SUBSCRIBE, ABSENCE_USER_SUCCESS, ABSENCE_USER_FAILURE,
} from './types'

const initialState = {
  presentUsers: [],

  loadPresencesDone: false,
  loadPresencesLoading: false,
  loadPresencesError: null,
  presenceUserDone: false,
  presenceUserLoading: false,
  presenceUserError: null,
  absenceUserDone: false,
  absenceUserLoading: false,
  absenceUserError: null,
}

const presenceReducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LOAD_PRESENCES_REQUEST:
        draft.presenceUserLoading = true;
        draft.presenceUserDone = false;
        draft.presenceUserError = null;
        break;
      case LOAD_PRESENCES_SUCCESS:
        draft.presentUsers = action.data.users;
        draft.presenceUserLoading = false;
        draft.presenceUserDone = true;
        break;
      case LOAD_PRESENCES_FAILURE:
        draft.presenceUserLoading = false;
        draft.presenceUserError = action.error;
        break;
      case PRESENCE_USER_SUBSCRIBE:
        draft.presenceUserLoading = true;
        draft.presenceUserDone = false;
        draft.presenceUserError = null;
        break;
      case PRESENCE_USER_SUCCESS: {
        const presenceIndex = draft.presentUsers.findIndex(presence => presence._id === action.data.userId)
        draft.presentUsers[presenceIndex].presence = true;
        draft.presenceUserLoading = false;
        draft.presenceUserDone = true;
        break;
      }
      case PRESENCE_USER_FAILURE:
        draft.presenceUserLoading = false;
        draft.presenceUserError = action.error;
        break;
      case ABSENCE_USER_SUBSCRIBE:
        draft.absenceUserLoading = true;
        draft.absenceUserDone = false;
        draft.absenceUserError = null;
        break;
      case ABSENCE_USER_SUCCESS: {
        const presenceIndex = draft.presentUsers.findIndex(presence => presence._id === action.data.userId)
        draft.presentUsers[presenceIndex].presence = false;
        draft.absenceUserLoading = false;
        draft.absenceUserDone = true;
        break;
      }
      case ABSENCE_USER_FAILURE:
        draft.absenceUserLoading = false;
        draft.absenceUserError = action.error;
        break;
      default:
        break;
    }
  })
}

export default presenceReducer;