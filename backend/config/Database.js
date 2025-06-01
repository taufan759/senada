import { Sequelize } from 'sequelize';

const db = new Sequelize('senada', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

export default db;