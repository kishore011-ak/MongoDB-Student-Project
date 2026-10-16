const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

const mongoose = require('mongoose');
const Student = require('./models/Student');
const { connectDB } = require('./config/database');

const sampleStudents = [
  {
    studentId: 'STU1001',
    fullName: 'Sophia Martinez',
    email: 'sophia.martinez@university.edu',
    phone: '+1 555-0101',
    department: 'Computer Science & Engineering',
    course: 'B.Tech Computer Science',
    yearOfStudy: 3,
    admissionDate: new Date('2023-08-15')
  },
  {
    studentId: 'STU1002',
    fullName: 'Ethan Wright',
    email: 'ethan.wright@university.edu',
    phone: '+1 555-0102',
    department: 'Artificial Intelligence & Data Science',
    course: 'B.Tech AI & Data Science',
    yearOfStudy: 2,
    admissionDate: new Date('2024-08-10')
  },
  {
    studentId: 'STU1003',
    fullName: 'Ananya Sharma',
    email: 'ananya.sharma@university.edu',
    phone: '+1 555-0103',
    department: 'Information Technology',
    course: 'B.Tech Information Technology',
    yearOfStudy: 4,
    admissionDate: new Date('2022-08-12')
  },
  {
    studentId: 'STU1004',
    fullName: 'Liam O\'Connor',
    email: 'liam.oconnor@university.edu',
    phone: '+1 555-0104',
    department: 'Electronics & Communication Engineering',
    course: 'B.Tech Electronics',
    yearOfStudy: 1,
    admissionDate: new Date('2025-08-18')
  },
  {
    studentId: 'STU1005',
    fullName: 'Zoe Patel',
    email: 'zoe.patel@university.edu',
    phone: '+1 555-0105',
    department: 'Mechanical Engineering',
    course: 'B.Tech Mechanical Engineering',
    yearOfStudy: 3,
    admissionDate: new Date('2023-08-20')
  },
  {
    studentId: 'STU1006',
    fullName: 'Marcus Vance',
    email: 'marcus.vance@university.edu',
    phone: '+1 555-0106',
    department: 'Civil Engineering',
    course: 'B.Tech Civil Engineering',
    yearOfStudy: 2,
    admissionDate: new Date('2024-08-14')
  },
  {
    studentId: 'STU1007',
    fullName: 'Elena Rostova',
    email: 'elena.rostova@university.edu',
    phone: '+1 555-0107',
    department: 'Biotechnology',
    course: 'B.Tech Biotechnology',
    yearOfStudy: 1,
    admissionDate: new Date('2025-08-19')
  },
  {
    studentId: 'STU1008',
    fullName: 'David Kim',
    email: 'david.kim@university.edu',
    phone: '+1 555-0108',
    department: 'Business Administration',
    course: 'BBA - Tech Management',
    yearOfStudy: 4,
    admissionDate: new Date('2022-08-10')
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting MongoDB Atlas Database Seeder...');
    const connected = await connectDB();

    if (!connected) {
      console.error('❌ Cannot seed database: Not connected to MongoDB Atlas.');
      console.log('ℹ️ Please ensure MONGODB_URI is configured in your .env file.');
      process.exit(1);
    }

    console.log('🧹 Clearing existing sample students in collection "students"...');
    await Student.deleteMany({ studentId: { $in: sampleStudents.map(s => s.studentId) } });

    console.log(`📥 Inserting ${sampleStudents.length} sample student documents...`);
    const inserted = await Student.insertMany(sampleStudents);
    console.log(`✅ Successfully seeded ${inserted.length} student records into MongoDB Atlas!`);

    await mongoose.connection.close();
    console.log('🔒 Database connection closed cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
