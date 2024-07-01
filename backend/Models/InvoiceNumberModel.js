const mongoose = require("mongoose")

const invoiceNumberSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true
    }
})

const InvoiceNumber = mongoose.model("InvoiceNumber", invoiceNumberSchema)

module.exports = InvoiceNumber