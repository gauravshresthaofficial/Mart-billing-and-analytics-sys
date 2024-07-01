const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  creditLimit: { type: Number },
  outstandingBalance: { type: Number },
  address: {
    country: String,
    province: String,
    district: String,
    street: String,
  },
  isDeleted: { type: Boolean, default: false } // Add isDeleted field with default value
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
