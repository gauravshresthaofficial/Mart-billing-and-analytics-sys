const {createCustomer, deleteCustomer, updateCustomer, getCustomerDetails, getCustomersList, getTotalCustomerCount, getAllCustomersList} = require("../Controllers/CustomerController")

const router = require("express").Router();

router.post("/", createCustomer)
router.get("/allcustomers" , getAllCustomersList )
router.patch("/:id", updateCustomer)
router.delete( "/:id" , deleteCustomer);
router.get("/" , getCustomersList )
router.get("/total-count", getTotalCustomerCount)
router.get("/:id" , getCustomerDetails )

module.exports = router;