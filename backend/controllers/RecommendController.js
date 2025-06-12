import { jwtDecode } from "jwt-decode";
import InvestmentRecommendation from "../models/RecommendModel.js";

export const addRecommend = async (req, res) => {
  const result = req.body;
  const authHeader = req.headers.authorization;
  const userId = jwtDecode(authHeader.split(' ')[1]).userId;
  const profileRisiko = result.profile_risiko; // Ambil field profile_risiko dari body
  console.log(result)

  try {
    // Hapus terlebih dahulu record yang memiliki userId yang sama
    await InvestmentRecommendation.destroy({ where: { userId } });

    const savedRecommendations = await Promise.all(
      result.rekomendasi.map(async (r) => {
        return await InvestmentRecommendation.create({ ...r, userId, profile_risiko: profileRisiko });
      })
    );
    res.status(201).json(savedRecommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
    // console.log(error);
  }
}

export const getRecommend = async (req, res) => {
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
    const recommend = await InvestmentRecommendation.findAll({
      where: { userId: userId },
      attributes: ['jenis_produk', 'profile_risiko', 'nama_produk', 'skor_kecocokan', 'tingkat_risiko'],
      order: [['id', 'DESC']],
    });
    res.status(200).json(recommend);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}
