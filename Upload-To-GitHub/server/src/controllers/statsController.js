const Student = require('../models/Student');

/**
 * @desc   Get real-time dashboard statistics from MongoDB Atlas
 * @route  GET /api/stats
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();

    // Aggregation: department counts
    const departmentStats = await Student.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Aggregation: year of study distribution
    const yearStats = await Student.aggregate([
      {
        $group: {
          _id: '$yearOfStudy',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Retrieve last 5 recently added students
    const recentStudents = await Student.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('studentId fullName department course yearOfStudy createdAt')
      .lean();

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalDepartments: departmentStats.length,
        departmentDistribution: departmentStats.map(item => ({
          department: item._id,
          count: item.count
        })),
        yearDistribution: yearStats.map(item => ({
          year: item._id,
          count: item.count
        })),
        recentStudents
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
