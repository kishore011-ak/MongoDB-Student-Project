const mongoose = require('mongoose');
const Student = require('../models/Student');

/**
 * Helper to find student by either MongoDB _id or custom studentId
 */
const findByIdOrStudentId = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const student = await Student.findById(id);
    if (student) return student;
  }
  return await Student.findOne({ studentId: id.toUpperCase() });
};

/**
 * @desc   Get all students with pagination, search, and filtering
 * @route  GET /api/students
 */
const getAllStudents = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const { search, department, yearOfStudy, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Build filter query object
    const filter = {};

    // Search by student ID or full name or email (case-insensitive)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { studentId: searchRegex },
        { fullName: searchRegex },
        { email: searchRegex }
      ];
    }

    // Filter by department
    if (department && department.trim() !== '' && department !== 'All') {
      filter.department = department.trim();
    }

    // Filter by year of study
    if (yearOfStudy && yearOfStudy !== 'All') {
      const yearNum = parseInt(yearOfStudy, 10);
      if (!isNaN(yearNum)) {
        filter.yearOfStudy = yearNum;
      }
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute queries
    const [total, students] = await Promise.all([
      Student.countDocuments(filter),
      Student.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      totalPages,
      currentPage: page,
      limit,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get single student by ID
 * @route  GET /api/students/:id
 */
const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await findByIdOrStudentId(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with ID "${id}" was not found in the database`
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create new student record
 * @route  POST /api/students
 */
const createStudent = async (req, res, next) => {
  try {
    const {
      studentId,
      fullName,
      email,
      phone,
      department,
      course,
      yearOfStudy,
      admissionDate
    } = req.body;

    // Ensure studentId is uppercase
    const formattedStudentId = studentId ? studentId.trim().toUpperCase() : '';

    // Check if studentId already exists before creating
    const existingId = await Student.findOne({ studentId: formattedStudentId });
    if (existingId) {
      return res.status(409).json({
        success: false,
        message: `Student ID "${formattedStudentId}" already exists. Please choose a unique ID.`
      });
    }

    // Check if email already exists
    const existingEmail = await Student.findOne({ email: email ? email.trim().toLowerCase() : '' });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: `Email address "${email}" is already registered with another student.`
      });
    }

    const newStudent = new Student({
      studentId: formattedStudentId,
      fullName,
      email,
      phone,
      department,
      course,
      yearOfStudy: Number(yearOfStudy),
      admissionDate: admissionDate || Date.now()
    });

    const savedStudent = await newStudent.save();

    res.status(201).json({
      success: true,
      message: 'Student record created successfully in MongoDB Atlas',
      data: savedStudent
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update existing student record
 * @route  PUT /api/students/:id
 */
const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await findByIdOrStudentId(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with ID "${id}" was not found`
      });
    }

    const updates = { ...req.body };

    // Prevent overwriting internal MongoDB _id
    delete updates._id;

    // Check if studentId is being modified and conflict exists
    if (updates.studentId) {
      updates.studentId = updates.studentId.trim().toUpperCase();
      if (updates.studentId !== student.studentId) {
        const idTaken = await Student.findOne({ studentId: updates.studentId });
        if (idTaken) {
          return res.status(409).json({
            success: false,
            message: `Student ID "${updates.studentId}" is already taken by another student.`
          });
        }
      }
    }

    // Check if email is being changed and conflict exists
    if (updates.email) {
      updates.email = updates.email.trim().toLowerCase();
      if (updates.email !== student.email) {
        const emailTaken = await Student.findOne({ email: updates.email });
        if (emailTaken) {
          return res.status(409).json({
            success: false,
            message: `Email "${updates.email}" is already in use by another student.`
          });
        }
      }
    }

    if (updates.yearOfStudy) {
      updates.yearOfStudy = Number(updates.yearOfStudy);
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      student._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Student record updated successfully',
      data: updatedStudent
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete a student record
 * @route  DELETE /api/students/:id
 */
const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await findByIdOrStudentId(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with ID "${id}" was not found`
      });
    }

    await Student.findByIdAndDelete(student._id);

    res.status(200).json({
      success: true,
      message: `Student "${student.fullName}" (${student.studentId}) successfully deleted from MongoDB Atlas`,
      data: {
        id: student._id,
        studentId: student.studentId,
        fullName: student.fullName
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
