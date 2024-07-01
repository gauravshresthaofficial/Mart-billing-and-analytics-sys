import {
  ADD_BILL,
  UPDATE_BILL,
  DELETE_BILL,
  GET_BILL,
  GET_BILL_RECORD,
  LATEST_ID,
} from "./billTypes";
import * as api from "../../api/index";

export const getBill = () => async (dispatch) => {
  try {
    const { data } = await api.fetchBills();
    dispatch({ type: GET_BILL, payload: data });
  } catch (error) {
    console.log("Error getting Bills", error);
  }
};

export const getBillRecord = (id) => async (dispatch) => {
  try {
    const { data } = await api.fetchBill(id);
    dispatch({ type: GET_BILL_RECORD, payload: data });
  } catch (error) {
    console.log("Error getting Bill Record", error);
  }
};

export const addBill = (bill) => async (dispatch) => {
  try {
    const newBilling = {
      dueDate: bill.dueDate ? new Date(bill.dueDate) : null,
      items: bill.items,
      vat: bill.taxAmt,
      discount: bill.disAmt,
      total: bill.total,
      notes: bill.notes,
      status: bill.status,
      invoiceNumber: bill.invoiceNumber,
      amtDue: bill.amountDue,
      customer: bill.client.id,
      paymentRecords: [
        {
          amountPaid: bill.amountPaid,
          datePaid: new Date(),
          paidBy: bill.paidBy,
        },
      ],
    };

    const { data } = await api.createBill(newBilling);
    console.log(newBilling, "mew in action");
    dispatch({ type: ADD_BILL, payload: data.billing });
    return data;
  } catch (error) {
    console.log("Error adding Bill", error);
  }
};

export const updateBill = (id, bill) => async (dispatch) => {
  try {
    const { data } = await api.updateBill(id, bill);
    dispatch({ type: UPDATE_BILL, payload: data.billing });
    console.log("from actions:", data);
  } catch (error) {
    console.log("Error updating Bill", error);
  }
};

export const deleteBill = (id) => async (dispatch) => {
  try {
    await api.deleteBill(id);

    dispatch({ type: DELETE_BILL, payload: id });
  } catch (error) {
    console.log("Error deleting Bill", error);
  }
};

export const latestId = () => async (dispatch) => {
  try {
    const {data} = await api.fetchLatestId();

    dispatch({type: LATEST_ID, payload: data.latestBillId})
  } catch (error) {
    console.log("Error getting Bill Id", error);
  }
};
