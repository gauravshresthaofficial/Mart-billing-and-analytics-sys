// importing the required modules
const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res, next) => {
  try {
    //destructuring the request body to get the user's email, password, username and date of creation
    const { email, password, username, createdAt, role } = req.body;

    console.log(req.body)

    //checking if user with the same email already exist,
    const existingUser = await User.findOne({ username });

    //if exist send JSON response with eroor message
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    // Creating a new user in the database with the provided email, hashed password, username, and the date of creation
    const user = await User.create({ email, password, username, createdAt, role });
    //Send the secret token to the email for verification
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    res
      .status(201)
      .json({ message: "User signed in sucessfully", sucess: true, user });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.json({ message: "All fields are required" });
    }
    const user = await User.findOne({username});
    if (!user) {
      return res.json({ message: "Incorrect password or email" });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: "Incorrect password or email" });
    }
    const token = createSecretToken(user._id);
    console.log("1:" + token);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    console.log("2:" + req.cookies.token);
    res
      .status(201)
      .json({ message: "User logged in successfully", success: true, token });
    next();
  } catch (error) {
    console.error(error);
  }
};


