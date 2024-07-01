import {
  ADD_CUSTOMER,
  UPDATE_CUSTOMER,
  DELETE_CUSTOMER,
  GET_CUSTOMER,
} from "./customerType";

import * as api from "../../api/index";

export const getCustomers = () => async (dispatch) => {
  try {
    const { data } = await api.fetchCustomers();
    dispatch({ type: GET_CUSTOMER, payload: data });
  } catch (error) {
    console.log("Error getting customers", error);
  }
};

export const getAllCustomers = () => async (dispatch) => {
  try {
    const { data } = await api.fetchAllCustomers(); // Assuming fetchProducts is a function to fetch all products from the server
    dispatch({ type: GET_CUSTOMER, payload: data });
  } catch (error) {
    console.error("Error getting products:", error);
  }
};

export const addCustomer = (customer) => async (dispatch) => {
  try {
    const { data } = await api.createCustomer(customer);
    console.log(data);
    dispatch({ type: ADD_CUSTOMER, payload: data });
  } catch (error) {
    console.log("Error adding customer: ", error);
  }
};

export const updateCustomer = (id, updatedCudtomer) => async (dispatch) => {
  try {
    const { data } = await api.updateCustomer(id, updatedCudtomer);
    dispatch({ type: UPDATE_CUSTOMER, payload: data });
  } catch (error) {
    console.log("Error updating customer:", error);
  }
};

export const deleteCustomer = (id) => async (dispatch) => {
  try {
    const { data } = await api.deleteCustomer(id);
    console.log("delete actions");
    dispatch({ type: DELETE_CUSTOMER, payload: id });
  } catch (error) {
    console.log("Error deleting customer:", error);
  }
};
