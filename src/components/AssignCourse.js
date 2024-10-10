import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignCourse = () => {
  const [regNo, setRegNo] = useState('');
  const [courses, setCourses] = useState('');
  const [message, setMessage] = useState('');
  const [userRole, setUserRole] = useState(null);

  // Check if the logged-in user is an admin
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/userDetails', { withCredentials: true });
        const { role } = response.data.userDetails;
        setUserRole(role);
      } catch (err) {
        console.error('Error fetching user role:', err);
        setMessage('Failed to load user details.');
      }
    };
    fetchUserRole();
  }, []);
  const handleAssign = async (e) => {
    e.preventDefault();
  
    if (!regNo || !courses) {
      setMessage('Please provide both registration number and courses.');
      return;
    }
  
    const courseArray = courses.split(',').map((course) => course.trim()); // Convert input string to array
  
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/auth/assignCourse/${regNo}`,
        { courses: courseArray },
        { withCredentials: true }
      );
  
      if (response.status === 200) {
        setMessage(`Courses assigned to student with regNo ${regNo} successfully.`);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setMessage(`Error: ${err.response.data.message}`);
      } else {
        setMessage('Error assigning courses.');
      }
    }
  };
  
  
  

  // Render the page only if the user is an admin
  return (
    <div>
      <h1>Assign Courses to Student</h1>
      {userRole === 'admin' ? (
        <form onSubmit={handleAssign}>
          <label htmlFor="regNo">Student Registration Number:</label>
          <input
            type="text"
            id="regNo"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
          />

          <label htmlFor="courses">Courses (comma-separated):</label>
          <input
            type="text"
            id="courses"
            value={courses}
            onChange={(e) => setCourses(e.target.value)}
            placeholder="e.g. Math, Physics, AI"
          />

          <button type="submit">Assign Courses</button>
        </form>
      ) : (
        <p>You are not authorized to assign courses. Only admins can perform this action.</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default AssignCourse;
