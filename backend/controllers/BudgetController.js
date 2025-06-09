import Budget from "../models/BudgetModel.js";
import { jwtDecode } from 'jwt-decode';

export const getBudget = async (req, res) => {
  try {
    // Ambil userId dari token yang dikirim di header Authorization
    const authHeader = req.headers.authorization;
    let userId;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        userId = jwtDecode(authHeader.split(' ')[1]).userId;
      } catch (err) {
        return res.status(401).json({ message: 'Token tidak valid' });
      }
    } else {
      return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    const transaction = await Budget.findAll({
      where: { userId },
      attributes: ['budgetId', 'category', 'allocated', 'type', 'budgetName'],
      order: [['budgetId', 'DESC']],
    });
    res.status(200).json(transaction);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
}

export const addBudget = async (req, res) => {
  const { category, allocated, type, budgetName } = req.body;
  console.log('userId, category, allocated, type, budgetName');

  // Ambil userId dari token yang dikirim di header Authorization
  const authHeader = req.headers.authorization;
  let userId;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      userId = jwtDecode(authHeader.split(' ')[1]).userId;
    } catch (err) {
      return res.status(401).json({ message: 'Token tidak valid' });
    }
  } else {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  // Cek apakah kategori sudah ada untuk user tersebut
  const existingBudget = await Budget.findOne({
    where: {
      userId,
      category
    }
  });

  if (existingBudget) {
    return res.status(400).json({ message: 'Kategori anggaran sudah ada' });
  }

  try {
    const budget = await Budget.create({
      userId,
      category,
      allocated,
      type,
      budgetName
    });
    res.status(201).json(budget);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
}

export const deleteBudget = async (req, res) => {
  const { budgetId } = req.params;
  try {
    await Budget.destroy({ where: { budgetId } });
    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
}

export const updateBudget = async (req, res) => {
  const { budgetId } = req.params;
  const { category, allocated, type, budgetName } = req.body;
  try {
    await Budget.update({ category, allocated, type, budgetName }, { where: { budgetId } });
    res.status(200).json({ message: 'Budget updated successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
}