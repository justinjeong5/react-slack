import produce from 'immer'
import {
  LOAD_DIRECT_CANDIDATE_REQUEST, LOAD_DIRECT_CANDIDATE_SUCCESS, LOAD_DIRECT_CANDIDATE_FAILURE,
  LOAD_DIRECTS_REQUEST, LOAD_DIRECTS_SUCCESS, LOAD_DIRECTS_FAILURE,
  ADD_DIRECT_REQUEST, ADD_DIRECT_SUCCESS, ADD_DIRECT_FAILURE,
  RESET_DIRECT_STORE,
  ADD_STARRED, REMOVE_STARRED,
} from './types'

const initialState = {
  directList: [],
  currentDirect: [],

  loadDirectCandidateDone: false,
  loadDirectCandidateLoading: false,
  loadDirectCandidateError: null,
  loadDirectsDone: false,
  loadDirectsLoading: false,
  loadDirectsError: null,
  addDirectDone: false,
  addDirectLoading: false,
  addDirectError: null,
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
    description: `${target.nickname}님과 대화하세요!`,
    writer: target,
  }
  return result;
}

const directReducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
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
      case ADD_DIRECT_REQUEST:
        draft.addDirectLoading = true;
        draft.addDirectDone = false;
        draft.addDirectError = null;
        break;
      case ADD_DIRECT_SUCCESS:
        draft.currentDirect.push(userParser(action.data.direct, action.data.userId))
        draft.addDirectLoading = false;
        draft.addDirectDone = true;
        break;
      case ADD_DIRECT_FAILURE:
        draft.addDirectLoading = false;
        draft.addDirectError = action.error;
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
      default:
        break;
    }
  })
}

export default directReducer;