import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:4000" });

export const fetchProducts = () => API.get("/product");
export const fetchAllProducts = () => API.get("/product/allproducts");
export const fetchProduct = (id) => API.get(`/product/${id}`);
export const createProduct = (newProduct) => API.post("/product", newProduct);
export const updateProduct = (id, updatedProduct) =>
  API.patch(`/product/${id}`, updatedProduct);
export const deleteProduct = (id) => API.delete(`/product/${id}`);

// Bill API calls
export const fetchBills = () => API.get("/bill");
export const fetchLatestId = () => API.get("/bill/latestid");
export const fetchBill = (id) => API.get(`/bill/${id}`);
export const createBill = (newBill) => API.post("/bill", newBill);
export const updateBill = (id, updatedBill) =>
  API.patch(`/bill/${id}`, updatedBill);
export const deleteBill = (id) => API.delete(`/bill/${id}`);

// Customer API calls
export const fetchCustomers = () => API.get("/customer");
export const fetchAllCustomers = () => API.get("/customer/allcustomers");
export const fetchCustomer = (id) => API.get(`/customer/${id}`);
export const createCustomer = (newCustomer) =>
  API.post("/customer", newCustomer);
export const updateCustomer = (id, updatedCustomer) =>
  API.patch(`/customer/${id}`, updatedCustomer);
export const deleteCustomer = (id) => API.delete(`/customer/${id}`);

// Invoice number API calls
export const fetchInvoiceNumber = () => API.get("/invoice");
export const updateInvoiceNumber = async (newInvoiceNumber) => {
  console.log("New Invoice Number:", newInvoiceNumber); // Log the new invoice number

  try {
    const response = await API.post("/invoice", newInvoiceNumber);
    return response.data;
  } catch (error) {
    // Handle error
    console.error("Error updating invoice number:", error);
    throw error;
  }
};


//dashboard data
export const salesResponse = () => API.get("/bill/total-sales")
export const customerResponse = () => API.get("/customer/total-count")
export const productResponse = () => API.get("/product/total-count")
export const todaySalesResponse = () => API.get("/bill/today-sales")

export const userInfo = (username) => API.get(`/user/${username}`)
