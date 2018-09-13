import { createStore, combineReducers } from "redux";
import modules from "./reducers";

const reducers = combineReducers(Object.assign({}, modules));

export default function setUpStore() {
  const state = localStorage.getItem("storeState");
  return getStorage(state);
}

function getStorage(state) {
  if (state) {
    const jsonState = JSON.parse(state);
    const store = createStore(reducers, jsonState);
    global.store = store;
    return store;
  } else {
    const store = createStore(reducers, {});
    global.store = store;
    return store;
  }
}