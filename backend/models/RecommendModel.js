import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const InvestmentRecommendation = db.define('investmentRecommendation', {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  jenis_produk: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profile_risiko: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nama_produk: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  skor_kecocokan: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  tingkat_risiko: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  freezeTableName: true,
});

export default InvestmentRecommendation;

(async () => {
  await db.sync();
})();