import express from 'express';
import { getUsers, authenticate, register, updateProfile, changePassword } from '../controllers/UserController.js';
import { addTransaction, budgetTransactions, deleteTransaction, getTransaction, updateTransaction } from '../controllers/TransactionController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import authorize from '../middleware/authorize.js';
import { addBudget, deleteBudget, getBudget, updateBudget } from '../controllers/BudgetController.js';
import { addRecommend, getRecommend } from '../controllers/RecommendController.js';

const router = express.Router();

// Routes Users
router.get('/users', getUsers);

// Group routes yang memerlukan otentikasi
router.use('/transactions', verifyToken, authorize('user', 'admin'));

router.get('/transactions', getTransaction);
router.post('/transactions/add', addTransaction);
router.put('/transactions/update/:transactionId', updateTransaction);
router.delete('/transactions/delete/:transactionId', deleteTransaction);

router.use('/budget', verifyToken, authorize('user', 'admin'));

router.get('/budget', getBudget);
router.post('/budget/add', addBudget);
router.delete('/budget/delete/:budgetId', deleteBudget);
router.put('/budget/update/:budgetId', updateBudget);
router.get('/budget/transactions', budgetTransactions);

router.get('/recommend', getRecommend);
// router.post('/recommend', async (req, res) => {
//   try {
//     const response = await fetch('http://localhost:5000/recommend', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(req.body)
//     });

//     const data = await response.json();
//     res.json(data);
//     return data;
//   } catch (error) {
//     res.status(500).json({ error: 'ML Service Error' });
//   }
// });
// router.post('/recommend/add', addRecommend)

router.post('/recommend', async (req, res) => {
  try {
    const { 
      usia, 
      profil_risiko, 
      pendapatan_bulanan_juta, 
      tingkat_pengetahuan, 
      tujuan_keuangan, 
      target_dana_juta, 
      jangka_waktu_thn 
    } = req.body;

    // Generate simple recommendations based on risk profile
    let rekomendasi = [];

    if (profil_risiko === 'Konservatif') {
      rekomendasi = [
        {
          jenis_produk: 'Obligasi Pemerintah',
          nama_produk: 'Sukuk Retail SR-017',
          skor_kecocokan: 0.85,
          tingkat_risiko: 'Rendah'
        },
        {
          jenis_produk: 'Reksa Dana Pendapatan Tetap',
          nama_produk: 'Sucorinvest Bond Fund',
          skor_kecocokan: 0.80,
          tingkat_risiko: 'Rendah'
        },
        {
          jenis_produk: 'Deposito',
          nama_produk: 'Deposito Bank BUMN',
          skor_kecocokan: 0.75,
          tingkat_risiko: 'Rendah'
        }
      ];
    } else if (profil_risiko === 'Moderat') {
      rekomendasi = [
        {
          jenis_produk: 'Reksa Dana Campuran',
          nama_produk: 'Sucorinvest Balanced Fund',
          skor_kecocokan: 0.85,
          tingkat_risiko: 'Menengah'
        },
        {
          jenis_produk: 'Reksa Dana Index',
          nama_produk: 'Indeks LQ45',
          skor_kecocokan: 0.80,
          tingkat_risiko: 'Menengah'
        },
        {
          jenis_produk: 'P2P Lending',
          nama_produk: 'Investree Grade A',
          skor_kecocokan: 0.75,
          tingkat_risiko: 'Menengah'
        }
      ];
    } else if (profil_risiko === 'Agresif') {
      rekomendasi = [
        {
          jenis_produk: 'Reksa Dana Saham',
          nama_produk: 'Sucorinvest Equity Fund',
          skor_kecocokan: 0.90,
          tingkat_risiko: 'Tinggi'
        },
        {
          jenis_produk: 'Saham Blue Chip',
          nama_produk: 'Saham LQ45',
          skor_kecocokan: 0.85,
          tingkat_risiko: 'Tinggi'
        },
        {
          jenis_produk: 'Cryptocurrency',
          nama_produk: 'Bitcoin (BTC)',
          skor_kecocokan: 0.80,
          tingkat_risiko: 'Tinggi'
        }
      ];
    }

    // Adjust scores based on other factors
    rekomendasi = rekomendasi.map(item => {
      let adjustedScore = item.skor_kecocokan;
      
      // Adjust based on age
      if (parseInt(usia) < 30 && item.tingkat_risiko === 'Tinggi') {
        adjustedScore += 0.05;
      } else if (parseInt(usia) > 50 && item.tingkat_risiko === 'Rendah') {
        adjustedScore += 0.05;
      }
      
      // Adjust based on knowledge level
      if (tingkat_pengetahuan === 'Mahir' && item.tingkat_risiko === 'Tinggi') {
        adjustedScore += 0.03;
      } else if (tingkat_pengetahuan === 'Pemula' && item.tingkat_risiko === 'Rendah') {
        adjustedScore += 0.03;
      }

      return {
        ...item,
        skor_kecocokan: Math.min(adjustedScore, 1.0) // Cap at 1.0
      };
    });

    const response = {
      rekomendasi: rekomendasi,
      profil_risiko: profil_risiko,
      message: 'Rekomendasi berhasil dibuat'
    };

    res.json(response);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Error generating recommendations' });
  }
});

router.post('/recommend/add', addRecommend);

router.post('/authenticate', authenticate);
router.post('/register', register);
router.put('/profile', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePassword);

export default router;