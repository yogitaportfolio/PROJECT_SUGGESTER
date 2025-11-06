// controllers/studentController.js
const Student = require('../models/Student');

exports.getStudentPerformance = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findOne({ studentId });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (err) {
    console.error('Error fetching student data:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
