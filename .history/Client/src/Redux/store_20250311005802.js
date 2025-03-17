import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/rootReducer"; // or wherever you combine them

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
