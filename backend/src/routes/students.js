// const express = require('express');
// const router = express.Router();
// const { getStudentPerformance } = require('../controllers/studentController');
// const auth = require('../middleware/auth');

// // Example: GET /api/students/:id
// router.get('/:id', auth, getStudentPerformance);

// module.exports = router;
// routes/students.js
const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
  if (req.params.id === "CS2021001") {
    return res.json({
      name: "John Doe",
      studentId: "CS2021001",
      department: "Computer Science",
      currentYear: "Year 4",
      overallPercentage: 84.25,
      totalSubjects: 8,
      subjects: [
        { subject: "Programming Fundamentals", code: "CS101", year: "Year 1", marks: "85.00/100.00", percentage: 85 },
        { subject: "Statistics", code: "MATH201", year: "Year 2", marks: "82.00/100.00", percentage: 82 },
        { subject: "Data Structures", code: "CS201", year: "Year 2", marks: "78.00/100.00", percentage: 78 },
        { subject: "Linear Algebra", code: "MATH301", year: "Year 3", marks: "79.00/100.00", percentage: 79 },
        { subject: "Database Systems", code: "CS301", year: "Year 3", marks: "92.00/100.00", percentage: 92 },
        { subject: "Software Engineering", code: "CS302", year: "Year 3", marks: "88.00/100.00", percentage: 88 },
        { subject: "Machine Learning", code: "CS401", year: "Year 4", marks: "76.00/100.00", percentage: 76 },
        { subject: "Web Development", code: "CS402", year: "Year 4", marks: "94.00/100.00", percentage: 94 },
      ]
    });
  } else {
    res.status(404).json({ message: "Student not found" });
  }
});

module.exports = router;
