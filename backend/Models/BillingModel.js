const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
  dueDate: Date,
  items: [
    {
      itemName: String,
      unitPrice: String,
      cost: String,
      quantity: String,
      discount: String,
    },
  ],
  discount: Number,
  total: Number,
  notes: String,
  status: String,
  invoiceNumber: String,
  creator: [String],
  amtDue: Number,
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  paymentRecords: [
    {
      amountPaid: Number,
      datePaid: Date,
      paidBy: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Billing = mongoose.model("Billing", billingSchema);

module.exports = Billing;
