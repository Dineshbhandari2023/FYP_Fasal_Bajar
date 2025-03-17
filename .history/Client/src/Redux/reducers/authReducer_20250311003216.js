import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from "../types/authTypes";

const initialState = {
  loading: false,
  user: null,
  error: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true };
    case LOGIN_SUCCESS:
      return { loading: false, user: action.payload, error: null };
    case LOGIN_FAIL:
      return { loading: false, user: null, error: action.payload };
    case LOGOUT:
      return { ...state, user: null };
    default:
      return state;
  }
};
