import API from "../api/axios";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from "../types/authTypes";

// Login Action
export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const { data } = await API.post("/login", { email, password });

    const { accessToken, user_data } = data.Result;
    localStorage.setItem("accessToken", accessToken);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: user_data,
    });
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Logout Action
export const logoutUser = () => async (dispatch) => {
  try {
    await API.post("/logout");
    localStorage.removeItem("accessToken");
    dispatch({ type: LOGOUT });
  } catch (error) {
    console.error("Logout error:", error);
  }
};
