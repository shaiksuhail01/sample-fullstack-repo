import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeleteUser = () => {
  const [regNo, setRegNo] = useState('');
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

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!regNo) {
      setMessage('Please enter a registration number.');
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5000/api/auth/deleteUser/${regNo}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setMessage(`Student with regNo ${regNo} deleted successfully.`);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setMessage(`Error: ${err.response.data.message}`);
      } else {
        setMessage('Error deleting student.');
      }
    }
  };

  // Render page based on role
  return (
    <div>
      <h1>Delete Student</h1>
      {userRole === 'admin' ? (
        <form onSubmit={handleDelete}>
          <label htmlFor="regNo">Student Registration Number:</label>
          <input
            type="text"
            id="regNo"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
          />
          <button type="submit">Delete Student</button>
        </form>
      ) : (
        <p>You are not authorized to delete students. Only admins can perform this action.</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default DeleteUser;
