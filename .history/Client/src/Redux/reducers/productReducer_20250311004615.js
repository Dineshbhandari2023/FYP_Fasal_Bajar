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

const initialState = {
  loading: false,
  products: [],
  product: null,
  error: null,
};

// ==========================
// PRODUCTS REDUCER
// ==========================
export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    // ==========================
    // FETCH ALL PRODUCTS
    // ==========================
    case FETCH_PRODUCTS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload,
        error: null,
      };
    case FETCH_PRODUCTS_FAIL:
      return { ...state, loading: false, error: action.payload };

    // ==========================
    // GET SINGLE PRODUCT
    // ==========================
    case GET_PRODUCT_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_PRODUCT_SUCCESS:
      return { ...state, loading: false, product: action.payload, error: null };
    case GET_PRODUCT_FAIL:
      return { ...state, loading: false, error: action.payload };

    // ==========================
    // CREATE PRODUCT
    // ==========================
    case CREATE_PRODUCT_REQUEST:
      return { ...state, loading: true, error: null };
    case CREATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: [...state.products, action.payload],
        error: null,
      };
    case CREATE_PRODUCT_FAIL:
      return { ...state, loading: false, error: action.payload };

    // ==========================
    // UPDATE PRODUCT
    // ==========================
    case UPDATE_PRODUCT_REQUEST:
      return { ...state, loading: true, error: null };
    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        ),
        error: null,
      };
    case UPDATE_PRODUCT_FAIL:
      return { ...state, loading: false, error: action.payload };

    // ==========================
    // DELETE PRODUCT
    // ==========================
    case DELETE_PRODUCT_REQUEST:
      return { ...state, loading: true, error: null };
    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: state.products.filter(
          (product) => product.id !== action.payload
        ),
        error: null,
      };
    case DELETE_PRODUCT_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
