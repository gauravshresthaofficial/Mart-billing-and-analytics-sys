const express = require("express");
const router = express.Router();
const {
  createUser,
  getUserByEmail,
  updateUserByEmail,
  deleteUserByEmail,
  getUsersList,
} = require("../Controllers/UserController");

// Route for creating a new user
// router.post("/", createUser);

//Router for retrieving all the users
router.get("/", getUsersList)

// Route for retrieving user details by email
router.get("/:username", getUserByEmail);

// Route for updating user information by email
router.patch("/:username", updateUserByEmail);

// Route for deleting a user by email
router.delete("/:username", deleteUserByEmail);

module.exports = router;
