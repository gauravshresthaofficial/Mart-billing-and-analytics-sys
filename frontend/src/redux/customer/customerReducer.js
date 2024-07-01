import {
  ADD_CUSTOMER,
  UPDATE_CUSTOMER,
  DELETE_CUSTOMER,
  GET_CUSTOMER,
} from "./customerType";

const initialState = {
  customers: [],
};

export const customerReducer = (state = initialState, action) => {
  console.log("reducer file")
  switch (action.type) {
    case GET_CUSTOMER:
      console.log("reducer function")
      console.log(action.payload)
      return {
        ...state,
        customers: action.payload,
      };
    case ADD_CUSTOMER:
      return {
        ...state,
        customers: [...state.customers, action.payload.customer],
      };
    case UPDATE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.map((customer) => {
          if (customer._id === action.payload.customer._id) {
            return action.payload.customer;
          }
          return customer;
        }),
      };
    case DELETE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter(
          (customer) => customer._id !== action.payload
        ),
      };
    default:
      return state;
  }
};
