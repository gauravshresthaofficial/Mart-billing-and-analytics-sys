import {
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  GET_PRODUCT,
} from "./productTypes";

const initialState = {
  products: [],
};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCT: {
      return {
        ...state,
        products: action.payload,
      };
    }
    case ADD_PRODUCT: {
      return {
        ...state,
        products: [...state.products, action.payload.product],
      };
    }
    case UPDATE_PRODUCT: {
      return {
        ...state,
        products: state.products.map((product) => {
          if (product._id === action.payload.product._id) {
            return action.payload.product;
          }
          return product;
        }),
      };
    }
    case DELETE_PRODUCT: {
      return {
        ...state,
        products: state.products.filter(
          (product) => product._id !== action.payload
        ),
      };
    }
    default:
      return state;
  }
};
