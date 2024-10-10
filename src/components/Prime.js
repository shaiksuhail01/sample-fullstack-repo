import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Prime = () => {
  const [adminDetails, setAdminDetails] = useState(null);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/userDetails', { withCredentials: true });
        setAdminDetails(response.data.userDetails);
      } catch (err) {
        console.error('Error fetching admin details:', err);
      }
    };
    fetchAdminDetails();
  }, []);

  return (
    <div>
      <h1>Prime Page (Admin)</h1>
      {adminDetails ? (
        <div>
          <h2>Welcome, {adminDetails.name}</h2>
          <p>Age: {adminDetails.age}</p>
          <p>Department: {adminDetails.department}</p>
          <p>Email: {adminDetails.email}</p>
          <p>Designation: {adminDetails.designation}</p>
          <p>Experience: {adminDetails.experience} years</p>
        </div>
      ) : (
        <p>Loading admin details...</p>
      )}
    </div>
  );
};

export default Prime;
