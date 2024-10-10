import React, { useState,useEffect } from 'react';
import axios from 'axios';

const UploadProfilePicture = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [userRole, setUserRole] = useState(null);

  // Fetch user role
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await axios.patch('http://localhost:5000/api/auth/uploadProfilePicture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      if (response.status === 200) {
        setMessage('Profile picture uploaded successfully.');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setMessage(`Error: ${err.response.data.message}`);
      } else {
        setMessage('Error uploading profile picture.');
      }
    }
  };

  return (
    <div>
      <h1>Upload Profile Picture</h1>
      {userRole === 'student' ? (
        <form onSubmit={handleUpload}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button type="submit">Upload</button>
        </form>
      ) : (
        <p>You are not authorized to upload a profile picture. Only students can perform this action.</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadProfilePicture;
