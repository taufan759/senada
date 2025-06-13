import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['UserId', 'name', 'email', 'role'],
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
}

export const authenticate = async (req, res) => {
  const { email, password, } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const userId = user.userId;
    const name = user.name;
    const role = user.role;

    const accessToken = jwt.sign({ userId, name, email, role }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1d'
    });
    const refreshToken = jwt.sign({ userId, name, email, role }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d'
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ accessToken });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
}

export const register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) return res.status(400).json({ msg: "Passwords do not match" });

  // membuat enkripsi password
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user', // Default role
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
}

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findByPk(userId, {
      attributes: ['userId', 'name', 'email', 'role', 'phone', 'address', 'dateOfBirth', 'occupation']
    });
    
    if (!user) return res.status(404).json({ msg: "User not found" });
    
    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Dari middleware verifyToken
    const { name, email, phone, address, dateOfBirth, occupation } = req.body;

    console.log('Update Profile Request:', { userId, name, email, phone, address, dateOfBirth, occupation });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Update all profile fields
    await user.update({
      name: name || user.name,
      email: email || user.email,
      phone: phone || user.phone,
      address: address || user.address,
      dateOfBirth: dateOfBirth || user.dateOfBirth,
      occupation: occupation || user.occupation
    });

    // Return updated user data
    const updatedUser = await User.findByPk(userId, {
      attributes: ['userId', 'name', 'email', 'role', 'phone', 'address', 'dateOfBirth', 'occupation']
    });

    res.status(200).json({ 
      msg: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error('Update Profile Error:', error.message);
    res.status(500).json({ message: error.message });
  }
}

// Fungsi untuk ubah password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId; // Dari middleware verifyToken
    const { currentPassword, newPassword } = req.body;

    // Validasi input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ msg: "Current password and new password are required" });
    }

    // Cari user
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Verifikasi password lama
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Current password is incorrect" });

    // Hash password baru
    const salt = await bcrypt.genSalt();
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password di database
    await user.update({
      password: hashedNewPassword
    });

    res.status(200).json({ msg: "Password updated successfully" });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
}