import API from "../../api";
import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAIL,
  GET_PRODUCT_REQUEST,
  GET_PRODUCT_SUCCESS,
  GET_PRODUCT_FAIL,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
} from "../types/productTypes";

// ==========================
// GET ALL PRODUCTS
// ==========================
export const fetchProducts = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_PRODUCTS_REQUEST });

    const { data } = await API.get("/product");

    dispatch({
      type: FETCH_PRODUCTS_SUCCESS,
      payload: data.Result.productData,
    });
  } catch (error) {
    dispatch({
      type: FETCH_PRODUCTS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ==========================
// GET PRODUCT BY ID
// ==========================
export const getProductById = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_PRODUCT_REQUEST });

    const { data } = await API.get(`/product/${id}`);

    dispatch({
      type: GET_PRODUCT_SUCCESS,
      payload: data.Result.productData,
    });
  } catch (error) {
    dispatch({
      type: GET_PRODUCT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ==========================
// CREATE PRODUCT
// ==========================
export const createProduct =
  (formData, navigate) => async (dispatch, getState) => {
    try {
      dispatch({ type: CREATE_PRODUCT_REQUEST });

      const { token } = getState().auth; // Grab token from Redux state

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // <-- attach token
        },
      };

      const { data } = await API.post("/product", formData, config);

      dispatch({
        type: CREATE_PRODUCT_SUCCESS,
        payload: data.Result.productData,
      });

      alert("Product created successfully!");
      if (navigate) navigate("/dashboard");
    } catch (error) {
      dispatch({
        type: CREATE_PRODUCT_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
// ==========================
// UPDATE PRODUCT
// ==========================
export const updateProduct = (id, formData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });

    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };

    const { data } = await API.put(`/product/${id}`, formData, config);

    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: data.Result.productData,
    });

    alert("Product updated successfully!");
    if (navigate) navigate("/dashboard"); // Optional redirect
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ==========================
// DELETE PRODUCT
// ==========================
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });

    const { data } = await API.delete(`/product/${id}`);

    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: id, // Returning just the ID to remove from state
    });

    alert("Product deleted successfully!");
  } catch (error) {
    dispatch({
      type: DELETE_PRODUCT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const loginUser =
  (email, password, rememberMe, navigate) => async (dispatch) => {
    try {
      dispatch({ type: LOGIN_REQUEST });

      const { data } = await API.post("/login", { email, password });

      const { accessToken, refreshToken, user_data } = data.Result;

      // Save tokens properly
      if (rememberMe) {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user_data));
      } else {
        sessionStorage.setItem("token", accessToken);
        sessionStorage.setItem("user", JSON.stringify(user_data));
      }

      // Dispatch correct action with accessToken explicitly
      dispatch({
        type: LOGIN_SUCCESS,
        payload: user_data,
        token: accessToken, // <-- explicitly send token here
      });
      navigate("/dashboard");
    } catch (error) {
      dispatch({
        type: LOGIN_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
