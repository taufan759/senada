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