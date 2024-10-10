const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Ensure bcrypt is imported
const StudentDetails = require('../models/StudentDetails');
const AdminDetails = require('../models/AdminDetails');
const multer = require('multer');
const fs = require('fs');

const generateToken = (id, role, regNo) => {
  return jwt.sign({ id, role, regNo }, 'jwtsecret', { expiresIn: '1h' });
};


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if it doesn't exist
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const studentId = req.user.studentId || 'default'; // Use 'default' if studentId is undefined
    cb(null, `${studentId}-profile-${Date.now()}.jpg`); // Generate filename
  }
});
exports.upload = multer({ storage });



exports.loginUser = async (req, res) => {
  const { regNo, password } = req.body;

  const user = await User.findOne({ regNo });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials (user not found)' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials (password mismatch)' });
  }


  const token = generateToken(user._id, user.role, user.regNo); 
  res.cookie('token', token, { httpOnly: true });
  res.json({
    success: true,
    role: user.role,
    message: 'Login successful',
  });
};


exports.createUser = async (req, res) => {
    const { regNo, password, role } = req.body;
    try {
       
        const existingUser = await User.findOne({ regNo });
       
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

      
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ regNo, password: hashedPassword, role });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Server error', error: error.message }); 
    }
};


exports.getUserDetails=async (req, res) => {
  const { regNo, role } = req.user; 

  try {
    let userDetails;
    if (role === 'student') {
      userDetails = await StudentDetails.findOne({ studentId: regNo });
    } else if (role === 'admin') {
      userDetails = await AdminDetails.findOne({ adminId: regNo });
    }

    if (userDetails) {
      res.json({ userDetails });
    } else {
      res.status(404).json({ message: 'User details not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.updateStudent = async (req, res) => {
  const { regNo } = req.params; 
  const updatedData = req.body; 
  console.log(updatedData);
  try {
    const updatedStudent = await StudentDetails.findOneAndUpdate({ studentId: regNo }, updatedData, {
      new: true, 
      runValidators: true,
    });

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error });
  }
};

exports.deleteUser=async (req, res) => {
  const { regNo } = req.params;
  
  try {
    const user = await StudentDetails.findOneAndDelete({ studentId: regNo });

    if (!user) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting student' });
  }
};

exports.assignCourse= async (req, res) => {
  try {
    const { regNo } = req.params;
    const { courses } = req.body; // The courses should come in as an array

    // Ensure courses is an array before updating
    if (!Array.isArray(courses)) {
      return res.status(400).json({ message: 'Courses should be an array.' });
    }

    const student = await StudentDetails.findOne({ studentId:regNo });

    // If the student doesn't exist
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // Append new courses to the existing courses array
    student.courses = [...student.courses, ...courses];

    // Remove duplicate courses if needed (optional)
    student.courses = [...new Set(student.courses)];

    // Save the updated student document
    await student.save();
    res.status(200).json({ message: 'Courses updated successfully.', student });
  } catch (err) {
    console.error('Error updating courses:', err);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

exports.deleteCourse= async (req, res) => {
  const { studentId } = req.params;
  const { course } = req.body; // Expecting the course name to delete

  try {
    const student = await StudentDetails.findOne({ studentId });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Filter out the course to be deleted
    student.courses = student.courses.filter(c => c !== course);

    await student.save();
    return res.status(200).json({ message: `Course ${course} removed from student ${studentId} successfully.` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getStudentDetails=async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await StudentDetails.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    return res.status(200).json(student);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
exports.uploadProfilePicture = async (req, res) => {
  const { regNo } = req.user; // Assuming user data is stored in req.user
  const profilePictureUrl = req.file.path; // Path of the uploaded file

  try {
    const student = await StudentDetails.findOneAndUpdate(
      { studentId:regNo },
      { profilePicture: profilePictureUrl }, // Update profile picture field
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.status(200).json({ message: 'Profile picture uploaded successfully.', profilePicture: profilePictureUrl });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: 'Error uploading profile picture.' });
  }
};

exports.getStudents = async (req, res) => {
  const { course } = req.query; // Extract course from query parameters
  try {
    // Find students, filtering by course if provided
    const query = course ? { courses: course } : {};
    const students = await StudentDetails.find(query); // Use the query object

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found' });
    }

    return res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.getFilteredStudents = async (req, res) => {
  try {
    const { department, year } = req.query;
    let filter = {};
    if (department) filter.department = department;
    if (year) filter.year = year; // year is a string like "second year", "final year"

    const students = await StudentDetails.find(filter);

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found for the given criteria.' });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching filtered students:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
