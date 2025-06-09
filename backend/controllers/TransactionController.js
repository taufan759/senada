import Transaction from "../models/TransactionModel.js";
import { jwtDecode } from 'jwt-decode';
import { Op, Sequelize } from 'sequelize';


export const getTransaction = async (req, res) => {
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

    const transaction = await Transaction.findAll({
      where: { userId },
      attributes: ['transactionId', 'type', 'category', 'date', 'amount', 'transactionName', 'description', 'status'],
      order: [['date', 'DESC']],
    });
    res.status(200).json(transaction);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
}

export const budgetTransactions = async (req, res) => {
  const { month, year } = req.query;
  const authHeader = req.headers.authorization;
  let userId;
  userId = jwtDecode(authHeader.split(' ')[1], process.env.ACCESS_TOKEN_SECRET).userId;
  console.log(month, year, userId);
  const transactions = await Transaction.findAll({
    where: {
      userId,
      date: {
        [Op.and]: [
          Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('date')), month),
          Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('date')), year)
        ]
      }
    },
    attributes: ['transactionId', 'type', 'category', 'date', 'amount', 'transactionName', 'description', 'status'],
    order: [['date', 'DESC']],
  });
  res.status(200).json(transactions);
}

export const addTransaction = async (req, res) => {
  const { type, category, date, transactionName, amount, description } = req.body;

  // Ambil userId dari token yang dikirim di header Authorization
  const authHeader = req.headers.authorization;
  let userId;
  userId = jwtDecode(authHeader.split(' ')[1], process.env.ACCESS_TOKEN_SECRET).userId;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      // Ganti 'your_jwt_secret' dengan secret JWT yang sesuai
    } catch (err) {
      return res.status(401).json({ message: 'Token tidak valid' });
    }
  } else {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  try {
    const newTransaction = await Transaction.create({
      userId,
      type,
      category,
      date,
      transactionName,
      amount,
      description
    });
    console.log(newTransaction);

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
}

export const updateTransaction = async (req, res) => {
  const { transactionId } = req.params;
  const { type, category, date, transactionName, amount, description } = req.body;

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

  try {
    const transaction = await Transaction.update(
      { type, category, date, transactionName, amount, description },
      { where: { transactionId, userId } }
    );

    if (!transaction[0]) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
    }

    res.status(200).json({ message: 'Transaksi berhasil diperbarui' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
}

export const deleteTransaction = async (req, res) => {
  const { transactionId } = req.params;

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

  try {
    const transaction = await Transaction.destroy({
      where: { transactionId, userId }
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
    }

    res.status(200).json({ message: 'Transaksi berhasil dihapus' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
}
