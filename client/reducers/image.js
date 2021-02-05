import produce from 'immer'
import {
  UPLOAD_IMAGE_REQUEST, UPLOAD_IMAGE_SUCCESS, UPLOAD_IMAGE_FAILURE,
} from './types'

const initialState = {
  imagePath: [],

  uploadImageDone: false,
  uploadImageLoading: false,
  uploadImageError: null,
}

const imageReducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case UPLOAD_IMAGE_REQUEST:
        draft.uploadImageLoading = true;
        draft.uploadImageDone = false;
        draft.uploadImageError = null;
        break;
      case UPLOAD_IMAGE_SUCCESS:
        draft.imagePath = action.data.image;
        draft.uploadImageLoading = false;
        draft.uploadImageDone = true;
        break;
      case UPLOAD_IMAGE_FAILURE:
        draft.uploadImageLoading = false;
        draft.uploadImageError = action.error;
        break;
      default:
        break;
    }
  })
}

export default imageReducer;