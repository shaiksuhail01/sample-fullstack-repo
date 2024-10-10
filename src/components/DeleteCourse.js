import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeleteCourse = () => {
  const [regNo, setRegNo] = useState('');
  const [course, setCourse] = useState('');
  const [message, setMessage] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [courses, setCourses] = useState([]); // Store enrolled courses

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

  // Fetch enrolled courses when regNo changes
  const fetchCourses = async (studentId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/studentDetails/${studentId}`, { withCredentials: true });
      setCourses(response.data.courses); 
      setMessage('');// Set courses state
    } catch (err) {
      if (err.response && err.response.data) {
        setMessage(`Error: ${err.response.data.message}`);
      } else {
        setMessage('Error fetching courses.');
      }
    }
  };

  // Handle changes in registration number
  const handleRegNoChange = (e) => {
    const value = e.target.value;
    setRegNo(value);

    if (value) {
      fetchCourses(value); // Fetch courses when regNo is entered
    } else {
      setCourses([]); // Reset courses if regNo is cleared
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!regNo || !course) {
      setMessage('Please provide both registration number and course to delete.');
      return;
    }

    try {
      const response = await axios.patch(`http://localhost:5000/api/auth/assignCourse/${regNo}/deleteCourse`, 
      { course }, 
      { withCredentials: true });

      if (response.status === 200) {
        setMessage(`Course ${course} deleted from student with regNo ${regNo} successfully.`);
        setCourses((prevCourses) => prevCourses.filter((c) => c !== course)); // Remove deleted course from state
        setCourse(''); // Clear the course input
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setMessage(`Error: ${err.response.data.message}`);
      } else {
        setMessage('Error deleting course.');
      }
    }
  };

  // Render the page only if the user is an admin
  return (
    <div>
      <h1>Delete Course from Student</h1>
      {userRole === 'admin' ? (
        <form onSubmit={handleDelete}>
          <label htmlFor="regNo">Student Registration Number:</label>
          <input
            type="text"
            id="regNo"
            value={regNo}
            onChange={handleRegNoChange} // Update to new handler
          />

          {courses.length > 0 && (
            <div>
              <h3>Enrolled Courses:</h3>
              <ul>
                {courses.map((c, index) => (
                  <li key={index}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          <label htmlFor="course">Course to Delete:</label>
          <input
            type="text"
            id="course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="e.g. Math"
          />

          <button type="submit">Delete Course</button>
        </form>
      ) : (
        <p>You are not authorized to delete courses. Only admins can perform this action.</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default DeleteCourse;
