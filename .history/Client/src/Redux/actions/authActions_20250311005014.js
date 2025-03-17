import API from "../api/axios";
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

// LOGIN
export const loginUser = (email, password, navigate) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const { data } = await API.post("/login", { email, password });

    const { accessToken, user_data } = data.Result;

    localStorage.setItem("accessToken", accessToken);

    dispatch({ type: LOGIN_SUCCESS, payload: user_data });

    navigate("/dashboard");
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// LOGOUT
export const logoutUser = (navigate) => async (dispatch) => {
  try {
    await API.post("/logout");
    localStorage.removeItem("accessToken");

    dispatch({ type: LOGOUT });

    navigate("/login");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

// REGISTER
export const registerUser = (formData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_REQUEST });

    const { data } = await API.post("/register", formData, {
      headers: { "Content-Type": "application/json" },
    });

    dispatch({ type: REGISTER_SUCCESS, payload: data.Result.user_data });

    alert("Registration successful!");
    navigate("/login");
  } catch (error) {
    dispatch({
      type: REGISTER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// REFRESH TOKEN
export const refreshAccessToken = () => async (dispatch) => {
  try {
    dispatch({ type: REFRESH_TOKEN_REQUEST });

    const { data } = await API.post("/refresh-token");

    const { accessToken } = data.Result;

    localStorage.setItem("accessToken", accessToken);

    dispatch({ type: REFRESH_TOKEN_SUCCESS, payload: accessToken });
  } catch (error) {
    dispatch({
      type: REFRESH_TOKEN_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// FORGOT PASSWORD
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });

    const { data } = await API.post("/forgot-password", { email });

    dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data.Result });
  } catch (error) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// VERIFY RESET CODE
export const verifyResetCode = (resetCode) => async (dispatch) => {
  try {
    dispatch({ type: VERIFY_RESET_CODE_REQUEST });

    const { data } = await API.post("/verify-reset-code", { resetCode });

    dispatch({ type: VERIFY_RESET_CODE_SUCCESS, payload: data.Result });
  } catch (error) {
    dispatch({
      type: VERIFY_RESET_CODE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// RESET PASSWORD
export const resetPassword = (resetCode, newPassword) => async (dispatch) => {
  try {
    dispatch({ type: RESET_PASSWORD_REQUEST });

    const { data } = await API.post("/reset-password", {
      resetCode,
      newPassword,
    });

    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data.Result });
  } catch (error) {
    dispatch({
      type: RESET_PASSWORD_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
