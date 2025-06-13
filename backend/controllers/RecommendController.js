import { jwtDecode } from "jwt-decode";
import InvestmentRecommendation from "../models/RecommendModel.js";

export const addRecommend = async (req, res) => {
  try {
    const result = req.body;
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token tidak ditemukan' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwtDecode(token);
    const userId = decoded.userId;
    const profileRisiko = result.profile_risiko;
    
    console.log('Received data:', result);

    // Hapus terlebih dahulu record yang memiliki userId yang sama
    await InvestmentRecommendation.destroy({ where: { userId } });

    // Pastikan rekomendasi ada dan merupakan array
    if (!result.rekomendasi || !Array.isArray(result.rekomendasi)) {
      return res.status(400).json({ message: 'Data rekomendasi tidak valid' });
    }

    const savedRecommendations = await Promise.all(
      result.rekomendasi.map(async (r) => {
        return await InvestmentRecommendation.create({ 
          userId: userId,
          jenis_produk: r.jenis_produk,
          profile_risiko: profileRisiko,
          nama_produk: r.nama_produk,
          skor_kecocokan: r.skor_kecocokan,
          tingkat_risiko: r.tingkat_risiko
        });
      })
    );
    
    res.status(201).json({
      message: 'Rekomendasi berhasil disimpan',
      data: savedRecommendations
    });
  } catch (error) {
    console.error('Error saving recommendations:', error);
    res.status(500).json({ message: error.message });
  }
}

export const getRecommend = async (req, res) => {
  try {
    // Ambil userId dari token yang dikirim di header Authorization
    const authHeader = req.headers.authorization;
    let userId;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwtDecode(token);
        userId = decoded.userId;
      } catch (err) {
        return res.status(401).json({ message: 'Token tidak valid' });
      }
    } else {
      return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    const recommend = await InvestmentRecommendation.findAll({
      where: { userId: userId },
      attributes: [
        'Id',
        'jenis_produk', 
        'profile_risiko', 
        'nama_produk', 
        'skor_kecocokan', 
        'tingkat_risiko',
        'createdAt',
        'updatedAt'
      ],
      order: [['createdAt', 'DESC']],
    });
    
    res.status(200).json(recommend);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: error.message });
  }
}