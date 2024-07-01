const {
  createBilling,
  deleteBilling,
  updateBilling,
  getBillingDetails,
  getBillingsList,
  getTotalBillCount,
  getTotalSalesForPresentMonth,
  getTodaySales,
  getLatestBillId,
} = require("../Controllers/BillingContoller");
const updateOverdueStatus = require("../Middlewares/updateOverdueStatus");

const router = require("express").Router();

router.post("/", createBilling);
router.patch("/:id", updateBilling);
router.delete("/:id", deleteBilling);
router.get("/", updateOverdueStatus, getBillingsList);
router.get("/total-count", getTotalBillCount);
router.get("/total-sales", getTotalSalesForPresentMonth);
router.get("/today-sales", getTodaySales);
router.get("/latestid", getLatestBillId)
router.get("/:id", getBillingDetails);
// router.get("")

module.exports = router;
