const {
  generateInvoiceNumber,
  updateInvoiceNumber
} = require("../Controllers/InvoiceNumberController");

const router = require("express").Router();

router.get("/", generateInvoiceNumber);
router.post("/", updateInvoiceNumber);


module.exports = router;
