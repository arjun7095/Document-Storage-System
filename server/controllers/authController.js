// server/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { name, email, password, aadhar } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ name, email, password: hashedPassword, aadhar });
  await newUser.save();
  res.send("User registered successfully");
};

// Login function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password.' });

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password.' });

    // Generate JWT token
    const token = process.env.JWT_SECRET
    const userId=user._id
    // Send the token in response
    res.json({ message: 'Login successful', token,userId });
    console.log('succesully Logged In!!')
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch the authenticated user's profile
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Update user profile
exports.updateProfile = async (req, res) => {
  const { userId } = req.params; // Extract userId from the route parameter
  const { name, email, aadhar } = req.body; // Extract updated data from the request body

  try {
    // Find user by ID and update their profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, aadhar },
      { new: true, runValidators: true } // Return updated user and validate the input
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser); // Send updated user data
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update profile', error });
  }
};
