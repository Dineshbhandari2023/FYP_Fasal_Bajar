import { createStore, applyMiddleware } from "redux";
// Fix here:
import { default as thunk } from "redux-thunk"; // ESM import
import rootReducer from "./reducers/rootReducer";

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
