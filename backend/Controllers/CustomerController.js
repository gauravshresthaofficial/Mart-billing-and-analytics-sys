const Customer = require("../Models/CustomerModel");

// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const { name, creditLimit, outstandingBalance, email, phone, address } =
      req.body;

    console.log(req.body);
    // Validate input data (you can add more validation as needed)

    // Create a new customer instance
    const newCustomer = new Customer({
      name,
      creditLimit,
      outstandingBalance,
      email,
      phone,
      address,
    });

    // Save the customer to the database
    await newCustomer.save();

    res.status(201).json({
      message: "Customer created successfully",
      customer: newCustomer,
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Retrieve customer details
// exports.getCustomerDetails = async (req, res) => {
//   try {
//     const customerId = req.params.id; // Extract customer ID from request parameters

//     // Fetch customer details from the database
//     const customer = await Customer.findById(customerId);
//     console.log("customerId" + customerId)
//     console.log("c" + customer)

//     if (!customer) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     res.status(200).json({ customer });
//   } catch (error) {
//     console.error("Error fetching customer details:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

exports.getCustomerDetails = async (req, res) => {
  try {
    const customerId = req.params.id; // Extract customer ID from request parameters

    // Fetch customer details from the database
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ customer });
  } catch (error) {
    console.error("Error fetching customer details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getCustomersList = async (req, res) => {
  try {
    // Fetch customer details from the database
    const customers = await Customer.find({ isDeleted: false });

    if (!customers || customers.length === 0) {
      return res.status(404).json({ message: "No customers found" });
    }

    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customer details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllCustomersList = async (req, res) => {
  try {
    // Fetch customer details from the database
    const customers = await Customer.find();

    if (!customers || customers.length === 0) {
      return res.status(404).json({ message: "No customers found" });
    }

    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customer details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update customer information
exports.updateCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    const updatedData = req.body; // New data for updating

    // Update the customer in the database
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      updatedData,
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;

    // Mark the customer as deleted by setting isDeleted to true
    const deletedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer marked as deleted successfully" });
  } catch (error) {
    console.error("Error marking customer as deleted:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Get total count of bills
exports.getTotalCustomerCount = async (req, res) => {
  try {
    // Count the total number of bills in the database
    const totalCustomerCount = await Customer.countDocuments({isDeleted: false});
    console.log("counting customer", totalCustomerCount)


    res.status(200).json(totalCustomerCount);
  } catch (error) {
    console.error("Error getting total customer count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
