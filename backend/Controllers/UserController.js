const User = require("../Models/UserModel");
const bcrypt = require("bcryptjs");

// Controller for creating a new user
exports.createUser = async (req, res) => {
  try {
    const { email, username, password, role } = req.body;

    // Check if user with the provided email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user instance
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      role,
    });

    // Save the user to the database
    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUsersList = async (req, res) => {
  try {
    // Fetch customer details from the database
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No customers found" });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching customer details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for retrieving user details by email
exports.getUserByEmail = async (req, res) => {
  try {
    const username = req.params.username;
    console.log(username, "get ueser by email");

    // Fetch user details from the database
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for updating user information by email
// Controller for updating user information by email
exports.updateUserByEmail = async (req, res) => {
  try {
    const username = req.params.username;
    const updatedData = req.body; // New data for updating

    // Check if the new password is provided
    if (updatedData.password) {
      // Hash the new password
      updatedData.password = await bcrypt.hash(updatedData.password, 12);
    }

    // Update the user in the database
    const updatedUser = await User.findOneAndUpdate({ username }, updatedData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for deleting a user by email
exports.deleteUserByEmail = async (req, res) => {
  try {
    const email = req.params.username;

    // Delete the user from the database
    await User.findOneAndDelete({ username });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
