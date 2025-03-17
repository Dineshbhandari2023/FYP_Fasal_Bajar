import API from "../../api";
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

// GET ALL USERS (Admin/Protected)
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: GET_USERS_REQUEST });

    const { data } = await API.get("/users");

    dispatch({ type: GET_USERS_SUCCESS, payload: data.Result.data });
  } catch (error) {
    dispatch({
      type: GET_USERS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// GET SINGLE USER BY ID
export const getUserById = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_USER_BY_ID_REQUEST });

    const { data } = await API.get(`/users/${id}`);

    dispatch({ type: GET_USER_BY_ID_SUCCESS, payload: data.Result.user_data });
  } catch (error) {
    dispatch({
      type: GET_USER_BY_ID_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// GET CURRENT USER
export const getUserById = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_USER_BY_ID_REQUEST });

    const { data } = await API.get(`/users/${id}`);

    dispatch({ type: GET_USER_BY_ID_SUCCESS, payload: data.Result.user_data });
  } catch (error) {
    dispatch({
      type: GET_USER_BY_ID_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// UPDATE CURRENT USER
export const updateCurrentUser = (updateData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_REQUEST });

    const { data } = await API.put("/user", updateData, {
      headers: { "Content-Type": "application/json" },
    });

    dispatch({ type: UPDATE_USER_SUCCESS, payload: data.Result.user });

    alert("User updated successfully");
    if (navigate) navigate("/dashboard");
  } catch (error) {
    dispatch({
      type: UPDATE_USER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
