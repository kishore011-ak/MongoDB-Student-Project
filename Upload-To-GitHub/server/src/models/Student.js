const mongoose = require('mongoose');

/**
 * Student Schema definition for MongoDB Atlas
 * Collection: students
 */
const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [3, 'Student ID must be at least 3 characters'],
      maxlength: [20, 'Student ID cannot exceed 20 characters'],
      match: [/^[A-Za-z0-9\-_]+$/, 'Student ID can only contain alphanumeric characters, hyphens, and underscores']
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters long'],
      maxlength: [100, 'Full name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [
        /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/,
        'Please provide a valid contact number'
      ]
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      enum: {
        values: [
          'Computer Science & Engineering',
          'Information Technology',
          'Artificial Intelligence & Data Science',
          'Electronics & Communication Engineering',
          'Electrical & Electronics Engineering',
          'Mechanical Engineering',
          'Civil Engineering',
          'Biotechnology',
          'Business Administration',
          'Other'
        ],
        message: '{VALUE} is not a recognized department'
      }
    },
    course: {
      type: String,
      required: [true, 'Course program is required'],
      trim: true
    },
    yearOfStudy: {
      type: Number,
      required: [true, 'Year of study is required'],
      min: [1, 'Year of study must be at least 1'],
      max: [5, 'Year of study cannot exceed 5']
    },
    admissionDate: {
      type: Date,
      default: Date.now,
      required: [true, 'Date of admission is required']
    }
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
    versionKey: false
  }
);

// Compound and text indexes for search and queries
studentSchema.index({ department: 1, yearOfStudy: 1 });
studentSchema.index({ fullName: 'text', studentId: 'text' });

const Student = mongoose.model('Student', studentSchema, 'students');

module.exports = Student;
