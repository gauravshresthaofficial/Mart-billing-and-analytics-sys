const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProductDetails,
  getProductsList,
  updateProduct,
  deleteProduct,
  getTotalProductCount,
  getAllProductsList,
} = require("../Controllers/ProductController");

// Route for creating a new product
router.post("/", createProduct);

router.get("/total-count", getTotalProductCount);

// Route for retrieving list of all products
router.get("/allproducts", getAllProductsList);

// Route for retrieving product details by ID
router.get("/:id", getProductDetails);

// Route for retrieving list of non deleted products
router.get("/", getProductsList);

// Route for updating product information by ID
router.patch("/:id", updateProduct);

// Route for deleting a product by ID
router.delete("/:id", deleteProduct);

module.exports = router;
