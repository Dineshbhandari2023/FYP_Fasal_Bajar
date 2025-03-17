import { combineReducers } from "redux";
import authReducer from "./authReducer";
import { userReducer } from "./userReducer";
import { productReducer } from "./productReducer"; // from earlier

const rootReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  products: productReducer,
});

export default rootReducer;
