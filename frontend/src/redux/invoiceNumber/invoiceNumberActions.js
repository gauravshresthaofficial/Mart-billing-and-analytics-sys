import {
  GET_INVOICE_NUMBER,
  UPDATE_INVOICE_NUMBER,
} from "./invoiceNumberTypes";

import * as api from "../../api/index";

export const getInvoiceNumber = () => async (dispatch) => {
  try {
    const { data } = await api.fetchInvoiceNumber();
    dispatch({ type: GET_INVOICE_NUMBER, payload: data });
  } catch (error) {
    console.log("Error getting invoice number", error);
  }
};

export const updateInvNumber = (newInvoiceNumber) => async (dispatch) => {
  try {
    console.log(newInvoiceNumber, "In action")
    const { data } = await api.updateInvoiceNumber({newInvoiceNumber: newInvoiceNumber});
    console.log(data)
    dispatch({ type: UPDATE_INVOICE_NUMBER, payload: newInvoiceNumber });
  } catch (error) {
    console.log("Error updating invoice number", error);
  }
};
