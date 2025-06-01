import User from '../models/User.js';

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