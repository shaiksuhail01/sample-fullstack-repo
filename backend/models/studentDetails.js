const mongoose = require('mongoose');

const studentDetailsSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  year: {
    type: String,
    required: true,
  },
  gpa: {
    type: Number,
    required: true,
  },
  courses: {
    type: [String],
    default: [], // Default is an empty array
  },
  profilePicture: {
    type: String,
    default: null, // Default is null
  }
});

const StudentDetails = mongoose.model('StudentDetails', studentDetailsSchema);
module.exports = StudentDetails;
