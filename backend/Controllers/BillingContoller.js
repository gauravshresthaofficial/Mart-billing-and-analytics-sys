const Billing = require("../Models/BillingModel");

// Create a new billing
exports.createBilling = async (req, res) => {
  try {
    const billingData = req.body;

    // Create a new billing instance
    const newBilling = new Billing(billingData);

    // Save the billing to the database
    await newBilling.save();

    res.status(201).json({
      message: "Billing created successfully",
      billing: newBilling,
    });
  } catch (error) {
    console.error("Error creating billing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get total count of bills
exports.getTotalBillCount = async (req, res) => {
  try {
    // Count the total number of bills in the database
    const totalBillCount = await Billing.countDocuments();
    console.log("counting", totalBillCount);

    res.status(200).json(totalBillCount);
  } catch (error) {
    console.error("Error getting total bill count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Retrieve billing details by ID
exports.getBillingDetails = async (req, res) => {
  try {
    const billingId = req.params.id;

    // Fetch billing details from the database
    const billing = await Billing.findById(billingId).populate("customer");

    if (!billing) {
      return res.status(404).json({ error: "Billing not found" });
    }

    res.status(200).json(billing);
  } catch (error) {
    console.error("Error fetching billing details:", error);
    res.status(500).json({ error: "Internal server error dfasd" });
  }
};

// Retrieve list of billings
exports.getBillingsList = async (req, res) => {
  try {
    // Fetch billing details from the database
    const billings = await Billing.find().populate("customer");

    if (!billings || billings.length === 0) {
      return res.status(404).json({ error: "No billings found" });
    }

    res.status(200).json(billings);
  } catch (error) {
    console.error("Error fetching billing details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update billing information by ID
exports.updateBilling = async (req, res) => {
  try {
    const billingId = req.params.id;
    const newPaymentRecords = req.body.paymentRecords; // New payment records
    const updatedData = req.body; // New data for updating

    // Fetch the existing billing data from the database
    const existingBilling = await Billing.findById(billingId);

    if (!existingBilling) {
      return res.status(404).json({ error: "Billing not found" });
    }

    // Append new payment records to existing payment records
    updatedData.paymentRecords = [
      ...existingBilling.paymentRecords,
      ...newPaymentRecords,
    ];

    // Update the billing in the database
    const updatedBilling = await Billing.findByIdAndUpdate(
      billingId,
      updatedData,
      { new: true }
    );

    if (!updatedBilling) {
      return res.status(404).json({ error: "Billing not found" });
    }

    res.status(200).json({
      message: "Billing updated successfully",
      billing: updatedBilling,
    });
  } catch (error) {
    console.error("Error updating billing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a billing by ID
exports.deleteBilling = async (req, res) => {
  try {
    const billingId = req.params.id;

    // Delete the billing from the database
    await Billing.findByIdAndDelete(billingId);

    res.status(200).json({ message: "Billing deleted successfully" });
  } catch (error) {
    console.error("Error deleting billing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Calculate total sales for the present month
exports.getTotalSalesForPresentMonth = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Use MongoDB aggregation to sum the total field for the present month
    const totalSales = await Billing.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lt: endOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$total" }
        }
      }
    ]);

    // If there are no sales for the present month, totalSales will be an empty array
    const totalSalesAmount = totalSales.length > 0 ? totalSales[0].totalSales : 0;
    console.log(totalSalesAmount)

    res.status(200).json(totalSalesAmount);
  } catch (error) {
    console.error("Error calculating total sales for present month:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



// Calculate today's total sales
exports.getTodaySales = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Use MongoDB aggregation to sum the total field for today's sales
    const todaySales = await Billing.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lt: endOfDay }
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$total" }
        }
      }
    ]);

    // If there are no sales today, totalSales will be an empty array
    const todaySalesAmount = todaySales.length > 0 ? todaySales[0].totalSales : 0;

    res.status(200).json(todaySalesAmount);
  } catch (error) {
    console.error("Error calculating today's total sales:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Retrieve latest bill ID
exports.getLatestBillId = async (req, res) => {
  try {
    // Fetch the latest billing details from the database
    const latestBilling = await Billing.findOne().sort({ createdAt: -1 });

    if (!latestBilling) {
      return res.status(404).json({ error: "No billings found" });
    }

    // Retrieve the ID of the latest bill
    const latestBillId = latestBilling._id;

    res.status(200).json({latestBillId} );
  } catch (error) {
    console.error("Error fetching latest billing details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
