const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  cost: { type: Number, required: true },
  description: { type: String },
  discount: { type: Number },
  isDeleted: { type: Boolean, default: false }, // Added isDeleted column
  // Other product details (e.g., description, SKU, etc.)
});

module.exports = mongoose.model("Product", productSchema);
