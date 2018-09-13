import { SAVE_HASHTAGS } from "../reducers/hashtags";

export function saveHashtags(hashtagsList) {
  return { type: SAVE_HASHTAGS, hashtagsList }
}