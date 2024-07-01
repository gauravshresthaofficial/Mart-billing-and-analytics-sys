import {
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  GET_PRODUCT,
} from "./productTypes";
import * as api from "../../api/index";

export const getProduct = () => async (dispatch) => {
  try {
    const { data } = await api.fetchProducts(); // Assuming fetchProducts is a function to fetch non deleted products from the server
    dispatch({ type: GET_PRODUCT, payload: data});
  } catch (error) {
    console.error("Error getting products:", error);
  }
};
export const getAllProduct = () => async (dispatch) => {
  try {
    const { data } = await api.fetchAllProducts(); // Assuming fetchProducts is a function to fetch all products from the server
    dispatch({ type: GET_PRODUCT, payload: data});
  } catch (error) {
    console.error("Error getting products:", error);
  }
};

export const addProduct = (product) => async (dispatch) => {
  try {
    const { data } = await api.createProduct(product);
    console.log(data)
    dispatch({ type: ADD_PRODUCT, payload: data });
    console.log(data)
  } catch (error) {
    console.error("Error adding product:", error);
  }
};

export const updateProduct = (id, updatedProduct) => async (dispatch) => {
  try {
    console.log(updateProduct)
    const { data } = await api.updateProduct(id, updatedProduct);
    dispatch({ type: UPDATE_PRODUCT, payload: data });
  } catch (error) {
    console.error("Error updating product:", error);
  }
};

export const deleteProduct = (id) => async (dispatch) => {
  try {
    console.log("actions")
    await api.deleteProduct(id);
    dispatch({ type: DELETE_PRODUCT, payload: id });
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};
