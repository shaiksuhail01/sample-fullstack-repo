import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateStudent = () => {
  const [regNo, setRegNo] = useState('');
  const [studentData, setStudentData] = useState({
    name: '',
    age: '',
    department: '',
    email: '',
    year: '',
    gpa: '',
  });
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

  const handleChange = (e) => {
    setStudentData({
      ...studentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!regNo) {
      setMessage('Please enter a registration number.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/auth/updateStudent/${regNo}`, studentData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setMessage(`Student with regNo ${regNo} updated successfully.`);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setMessage(`Error: ${err.response.data.message}`);
      } else {
        setMessage('Error updating student.');
      }
    }
  };

  // Render page based on role
  return (
    <div>
      <h1>Update Student Details</h1>
      {userRole === 'admin' ? (
        <form onSubmit={handleUpdate}>
          <label htmlFor="regNo">Student Registration Number:</label>
          <input
            type="text"
            id="regNo"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
          />

          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={studentData.name}
            onChange={handleChange}
          />

          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={studentData.age}
            onChange={handleChange}
          />

          <label htmlFor="department">Department:</label>
          <input
            type="text"
            id="department"
            name="department"
            value={studentData.department}
            onChange={handleChange}
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={studentData.email}
            onChange={handleChange}
          />

          <label htmlFor="year">Year:</label>
          <input
            type="text"
            id="year"
            name="year"
            value={studentData.year}
            onChange={handleChange}
          />

          <label htmlFor="gpa">GPA:</label>
          <input
            type="text"
            id="gpa"
            name="gpa"
            value={studentData.gpa}
            onChange={handleChange}
          />

          <button type="submit">Update Student</button>
        </form>
      ) : (
        <p>You are not authorized to update student details. Only admins can perform this action.</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateStudent;
