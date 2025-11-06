const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subject: String,
  code: String,
  year: String,
  marks: String,
  percentage: Number
});

const studentSchema = new mongoose.Schema({
  name: String,
  studentId: String,
  department: String,
  currentYear: String,
  overallPercentage: Number,
  totalSubjects: Number,
  subjects: [subjectSchema]
});

module.exports = mongoose.model('Student', studentSchema);
