import {
  GET_INVOICE_NUMBER,
  UPDATE_INVOICE_NUMBER,
} from "./invoiceNumberTypes";

const initialState = {
  invoiceNumber: "",
};

export const invoiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_INVOICE_NUMBER:
      return {
        ...state,
        invoiceNumber: action.payload,
      };
    case UPDATE_INVOICE_NUMBER:
      return {
        ...state,
        invoiceNumber: action.payload,
      };
    default:
      return state;
  }
};
