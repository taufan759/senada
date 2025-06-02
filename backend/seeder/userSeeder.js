import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import db from '../config/Database.js';
import dotenv from 'dotenv';

dotenv.config();

const seedUsers = async () => {
  try {
    // Connect to database
    await db.authenticate();
    console.log('Database connected for seeding');
    
    // Sync database
    await db.sync();
    console.log('Database synced');
    
    // Check if users already exist
    const existingUsers = await User.count();
    
    if (existingUsers > 0) {
      console.log(`Database already has ${existingUsers} users. Skipping seed...`);
      process.exit(0);
    }
    
    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('password123', salt);
    const adminHashedPassword = await bcrypt.hash('admin123456', salt);
    
    // Sample users data
    const usersData = [
      {
        name: 'Super Admin',
        email: 'admin@senada.com',
        password: adminHashedPassword,
        role: 'super_admin'
      },
      {
        name: 'Admin User',
        email: 'admin.user@senada.com',
        password: adminHashedPassword,
        role: 'admin'
      },
      {
        name: 'Taufan',
        email: 'taufan@example.com',
        password: hashedPassword,
        role: 'user'
      },
      {
        name: 'Rayyen',
        email: 'rayyen@example.com',
        password: hashedPassword,
        role: 'user'
      },
      {
        name: 'Ramona',
        email: 'ramona@example.com',
        password: hashedPassword,
        role: 'user'
      },
      {
        name: 'Hilman',
        email: 'hilman@example.com',
        password: hashedPassword,
        role: 'user'
      },
      {
        name: 'Afif',
        email: 'afif@example.com',
        password: hashedPassword,
        role: 'user'
      },
      {
        name: 'Rizma',
        email: 'rizma@example.com',
        password: hashedPassword,
        role: 'user'
      },
    ];
    
    // Create users
    const createdUsers = await User.bulkCreate(usersData);
    
    console.log('✅ Users seeded successfully!');
    console.log(`📊 Created ${createdUsers.length} users`);
    console.log('\n👤 Admin Accounts:');
    console.log('📧 Super Admin: admin@senada.com | 🔑 Password: admin123456');
    console.log('📧 Admin: admin.user@senada.com | 🔑 Password: admin123456');
    console.log('\n👥 Regular Users:');
    console.log('🔑 All regular users password: password123');
    console.log('\n⚠️  Please change admin passwords after first login!');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

// Run seeder
seedUsers();