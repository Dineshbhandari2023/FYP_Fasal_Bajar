import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  REFRESH_TOKEN_REQUEST,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  VERIFY_RESET_CODE_REQUEST,
  VERIFY_RESET_CODE_SUCCESS,
  VERIFY_RESET_CODE_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
} from "../types/authTypes";

// const initialState = {
//   loading: false,
//   user: null,
//   error: null,
//   accessToken: localStorage.getItem("accessToken") || null,
// };

// export const authReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case LOGIN_REQUEST:
//     case REGISTER_REQUEST:
//     case REFRESH_TOKEN_REQUEST:
//     case FORGOT_PASSWORD_REQUEST:
//     case VERIFY_RESET_CODE_REQUEST:
//     case RESET_PASSWORD_REQUEST:
//       return { ...state, loading: true, error: null };

//     case LOGIN_SUCCESS:
//     case REGISTER_SUCCESS:
//       return { ...state, loading: false, user: action.payload, error: null };

//     case REFRESH_TOKEN_SUCCESS:
//       return { ...state, loading: false, accessToken: action.payload };

//     case FORGOT_PASSWORD_SUCCESS:
//     case VERIFY_RESET_CODE_SUCCESS:
//     case RESET_PASSWORD_SUCCESS:
//       return { ...state, loading: false };

//     case LOGIN_FAIL:
//     case REGISTER_FAIL:
//     case REFRESH_TOKEN_FAIL:
//     case FORGOT_PASSWORD_FAIL:
//     case VERIFY_RESET_CODE_FAIL:
//     case RESET_PASSWORD_FAIL:
//       return { ...state, loading: false, error: action.payload };

//     case LOGOUT:
//       return { ...initialState, accessToken: null };

//     default:
//       return state;
//   }
// };

const initialState = {
  loading: false,
  user: null,
  error: null,
  accessToken: localStorage.getItem("token") || null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };

    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.token); // also persist token explicitly here!
      localStorage.setItem("user", JSON.stringify(action.payload));

      return {
        ...state,
        loading: false,
        user: action.payload,
        accessToken: action.token, // ✅ store token from action here
        error: null,
      };

    case LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case LOGOUT:
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken");
      return {
        loading: false,
        user: null,
        accessToken: null,
        error: null,
      };

    default:
      return state;
  }
};

export default authReducer;
