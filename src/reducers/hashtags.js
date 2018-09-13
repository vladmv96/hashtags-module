export const SAVE_HASHTAGS = "SAVE_HASHTAGS";

const initialState = {
    hashtagsList: {
      "" : []
    }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SAVE_HASHTAGS:
      return { ...state, hashtagsList: action.hashtagsList };
    default:
      return state;
  }
}