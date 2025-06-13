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
    
    // **FORCE DELETE ALL EXISTING USERS**
    const existingUsers = await User.count();
    if (existingUsers > 0) {
      console.log(`🗑️  Found ${existingUsers} existing users. Deleting all...`);
      await User.destroy({
        where: {},
        truncate: true // This will reset the auto-increment
      });
      console.log('✅ All existing users deleted!');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('password123', salt);
    const adminHashedPassword = await bcrypt.hash('admin123456', salt);
    
    // Sample users data - hanya admin dan user
    const usersData = [
      {
        name: 'Admin Senada',
        email: 'admin@senada.com',
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
    
    console.log('\n🎉 ===== SEEDING COMPLETED ===== 🎉');
    console.log(`📊 Created ${createdUsers.length} new users`);
    console.log('\n👤 Admin Account:');
    console.log('📧 Email: admin@senada.com');
    console.log('🔑 Password: admin123456');
    console.log('🛡️  Role: admin');
    console.log('\n👥 Regular Users:');
    console.log('🔑 Password for all users: password123');
    console.log('👤 Role: user');
    console.log('\n📋 User List:');
    createdUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
    });
    console.log('\n⚠️  Please change admin password after first login!');
    console.log('✅ Database successfully reset and seeded!');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();