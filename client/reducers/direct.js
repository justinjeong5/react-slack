import produce from 'immer'
import {
  AUTH_USER_SUCCESS, AUTH_USER_FAILURE,
  LOAD_DIRECT_CANDIDATE_REQUEST, LOAD_DIRECT_CANDIDATE_SUCCESS, LOAD_DIRECT_CANDIDATE_FAILURE,
  LOAD_DIRECTS_REQUEST, LOAD_DIRECTS_SUCCESS, LOAD_DIRECTS_FAILURE,
  CREATE_DIRECT_SUBSCRIBE, CREATE_DIRECT_SUCCESS, CREATE_DIRECT_FAILURE,
  RESET_DIRECT_STORE,
  ADD_STARRED, REMOVE_STARRED,
  SET_USER_IMAGE_SUCCESS,
} from './types'

const initialState = {
  directList: [],
  currentDirect: [],

  currentUserId: null,
  loadDirectCandidateDone: false,
  loadDirectCandidateLoading: false,
  loadDirectCandidateError: null,
  loadDirectsDone: false,
  loadDirectsLoading: false,
  loadDirectsError: null,
  createDirectDone: false,
  createDirectLoading: false,
  createDirectError: null,
}

export const userParser = (direct, userId) => {
  const target = userId === direct.user1._id
    ? direct.user2
    : direct.user1;
  const result = {
    _id: direct._id,
    title: target.nickname,
    private: true,
    starred: direct.starred,
    typing: direct.typing,
    description: `${target.nickname}님과 대화하세요!`,
    writer: target,
  }
  return result;
}

const directReducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case AUTH_USER_SUCCESS:
        draft.currentUserId = action.data.user._id;
        break;
      case AUTH_USER_FAILURE:
        draft.currentUserId = null;
        break;
      case LOAD_DIRECT_CANDIDATE_REQUEST:
        draft.loadDirectCandidateLoading = true;
        draft.loadDirectCandidateDone = false;
        draft.loadDirectCandidateError = null;
        break;
      case LOAD_DIRECT_CANDIDATE_SUCCESS:
        draft.directList = action.data.directs;
        draft.loadDirectCandidateLoading = false;
        draft.loadDirectCandidateDone = true;
        break;
      case LOAD_DIRECT_CANDIDATE_FAILURE:
        draft.loadDirectCandidateLoading = false;
        draft.loadDirectCandidateError = action.error;
        break;
      case LOAD_DIRECTS_REQUEST:
        draft.loadDirectsLoading = true;
        draft.loadDirectsDone = false;
        draft.loadDirectsError = null;
        break;
      case LOAD_DIRECTS_SUCCESS:
        draft.currentDirect = action.data.directs.map(direct => userParser(direct, action.data.userId));
        draft.loadDirectsLoading = false;
        draft.loadDirectsDone = true;
        break;
      case LOAD_DIRECTS_FAILURE:
        draft.loadDirectsLoading = false;
        draft.loadDirectsError = action.error;
        break;
      case CREATE_DIRECT_SUBSCRIBE:
        draft.createDirectLoading = true;
        draft.createDirectDone = false;
        draft.createDirectError = null;
        break;
      case CREATE_DIRECT_SUCCESS:
        if (action.data.direct.user1._id === draft.currentUserId ||
          action.data.direct.user2._id === draft.currentUserId) {
          draft.currentDirect.push(userParser(action.data.direct, draft.currentUserId))
          draft.createDirectLoading = false;
          draft.createDirectDone = true;
        }
        break;
      case CREATE_DIRECT_FAILURE:
        draft.createDirectLoading = false;
        draft.createDirectError = action.error;
        break;
      case RESET_DIRECT_STORE:
        draft.directList = [];
        draft.currentDirect = [];
        break;
      case ADD_STARRED:
      case REMOVE_STARRED:
        const directIndex = draft.currentDirect.findIndex(direct => direct._id === action.data.star._id);
        if (directIndex !== -1) {
          draft.currentDirect[directIndex].starred = action.data.star.starred;
        }
        break;
      case SET_USER_IMAGE_SUCCESS:
        draft.currentDirect = draft.currentDirect.map(direct => {
          if (direct.writer._id === action.data.userId) {
            direct.writer.image = action.data.image
          }
          return direct;
        })
        break;
      default:
        break;
    }
  })
}

export default directReducer;