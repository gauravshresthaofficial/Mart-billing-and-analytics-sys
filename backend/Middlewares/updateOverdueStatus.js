const Billing = require("../Models/BillingModel");

const updateOverdueStatus = async (req, res, next) => {
  try {
    const today = new Date();

    // Update bills that are fully paid
    const paidResult = await Billing.updateMany(
      { amtDue: 0, status: { $ne: "Paid" } },
      { $set: { status: "Paid" } }
    );
    console.log(`Paid status updated: matched ${paidResult.matchedCount}, modified ${paidResult.modifiedCount}`);

    // Update bills that are overdue
    const overdueResult = await Billing.updateMany(
      { amtDue: { $gt: 0 }, dueDate: { $lt: today }, status: { $ne: "Overdue" } },
      { $set: { status: "Overdue" } }
    );
    console.log(`Overdue status updated: matched ${overdueResult.matchedCount}, modified ${overdueResult.modifiedCount}`);

    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error("Error updating overdue statuses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = updateOverdueStatus;
