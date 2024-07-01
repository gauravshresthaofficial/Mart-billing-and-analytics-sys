import { combineReducers } from "redux";
import { productReducer } from "./product/productReducer";
import { billReducer } from "./bill/billReducer";
import { customerReducer } from "./customer/customerReducer";
import { invoiceReducer } from "./invoiceNumber/invoiceNumberReducer";

const rootReducer = combineReducers({
  products: productReducer,
  bills: billReducer,
  customers: customerReducer,
  invoiceNumber: invoiceReducer,
});

export default rootReducer;
