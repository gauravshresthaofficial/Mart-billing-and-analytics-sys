const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const { MONGODB_URL, PORT } = process.env;
const authRoute = require("./Routes/AuthRoute");
const customerRoute = require("./Routes/CustomerRoute");
const productRoute = require("./Routes/ProductRoute");
const userRoute = require("./Routes/UserRoute");
const billingRoute = require("./Routes/BillingRoute");
const invoiceNumber = require("./Routes/InvoiceNumberRoute");

mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error("error : " + err));

app.listen(PORT || 4000, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(MONGODB_URL)
});

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.use("/", authRoute);

app.use("/customer", customerRoute);
app.use("/bill", billingRoute);
app.use("/product", productRoute);
app.use("/user", userRoute);
app.use("/invoice", invoiceNumber);
