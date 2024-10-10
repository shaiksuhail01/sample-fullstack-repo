const express = require('express');
const { loginUser, getUserDetails,assignCourse,deleteCourse,updateStudent, createUser,deleteUser,getStudentDetails,uploadProfilePicture,upload,getStudents,getFilteredStudents} = require('../controllers/authController');
const { protect, admin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/login', loginUser);
router.post('/register', createUser); 
router.get('/userDetails', protect, getUserDetails);
router.get('/studentDetails/:studentId',protect,getStudentDetails);
router.delete('/deleteUser/:regNo',protect,admin,deleteUser);
router.put('/updateStudent/:regNo',protect,admin,updateStudent);
router.patch('/assignCourse/:regNo',protect,admin,assignCourse);
router.patch('/assignCourse/:studentId/deleteCourse',protect,admin,deleteCourse);
router.patch('/uploadProfilePicture', protect, upload.single('profilePicture'), uploadProfilePicture);
router.get('/students', protect, getStudents);
router.get('/students/dept', protect, getFilteredStudents);
module.exports = router;
