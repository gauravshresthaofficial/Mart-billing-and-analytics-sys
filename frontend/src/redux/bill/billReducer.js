import {
  ADD_BILL,
  UPDATE_BILL,
  DELETE_BILL,
  GET_BILL,
  GET_BILL_RECORD,
  LATEST_ID,
} from "./billTypes";

const initialState = {
  bills: [],
};

export const billReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BILL:
      return {
        ...state,
        bills: action.payload,
      };
    case GET_BILL_RECORD:
      // Assuming action.payload is a single bill record, you might want to store it separately.z
      return {
        ...state,
        billRecord: action.payload,
      };
    case UPDATE_BILL: {
      return {
        ...state,
        billRecord: action.payload,
      };
    }
    case LATEST_ID: {
      return {
        ...state,
        latestId: action.payload,
      };
    }

    case DELETE_BILL: {
      return {
        ...state,
        bills: state.bills.filter((bill) => bill._id !== action.payload._id),
      };
    }

    case ADD_BILL: {
      return {
        ...state,
        bills: [...state.bills, action.payload],
      };
    }
    default:
      return state;
  }
};
