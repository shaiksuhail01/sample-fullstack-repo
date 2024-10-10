import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [studentDetails, setStudentDetails] = useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/userDetails', { withCredentials: true });
        setStudentDetails(response.data.userDetails);
      } catch (err) {
        console.error('Error fetching student details:', err);
      }
    };
    fetchStudentDetails();
  }, []);

  return (
    <div>
      <h1>Home Page (Student)</h1>
      {studentDetails ? (
        <div>
          <h2>Welcome, {studentDetails.name}</h2>
          <img 
            src={`http://localhost:5000/${studentDetails.profilePicture}`} 
            alt={`${studentDetails.name}'s profile`} 
            style={{ width: '150px', height: '150px', borderRadius: '50%' }} 
          />
          <p>Age: {studentDetails.age}</p>
          <p>Department: {studentDetails.department}</p>
          <p>Email: {studentDetails.email}</p>
          <p>Year: {studentDetails.year}</p>
          <p>GPA: {studentDetails.gpa}</p>
        </div>
      ) : (
        <p>Loading student details...</p>
      )}
    </div>
  );
};

export default Home;
