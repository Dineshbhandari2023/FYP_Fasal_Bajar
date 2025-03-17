import {
  GET_USERS_REQUEST,
  GET_USERS_SUCCESS,
  GET_USERS_FAIL,
  GET_USER_BY_ID_REQUEST,
  GET_USER_BY_ID_SUCCESS,
  GET_USER_BY_ID_FAIL,
  GET_CURRENT_USER_REQUEST,
  GET_CURRENT_USER_SUCCESS,
  GET_CURRENT_USER_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
} from "../types/userTypes";

const initialState = {
  loading: false,
  users: [],
  user: null,
  currentUser: null,
  error: null,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USERS_REQUEST:
    case GET_USER_BY_ID_REQUEST:
    case GET_CURRENT_USER_REQUEST:
    case UPDATE_USER_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_USERS_SUCCESS:
      return { ...state, loading: false, users: action.payload };

    case GET_USER_BY_ID_SUCCESS:
      return { ...state, loading: false, user: action.payload };

    case GET_CURRENT_USER_SUCCESS:
      return { ...state, loading: false, currentUser: action.payload };

    case UPDATE_USER_SUCCESS:
      return { ...state, loading: false, currentUser: action.payload };

    case GET_USERS_FAIL:
    case GET_USER_BY_ID_FAIL:
    case GET_CURRENT_USER_FAIL:
    case UPDATE_USER_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
