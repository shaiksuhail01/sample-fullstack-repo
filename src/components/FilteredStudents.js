import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const FilteredStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchStudents = async () => {
      const query = new URLSearchParams(location.search); // Create an instance of URLSearchParams
      const department = query.get('department'); // Get the department from query parameters
      const year = query.get('year'); // Get the year from query parameters

      if (department && year) {
        try {
          // Fetch students based on department and year query parameters
          const response = await axios.get(
            `http://localhost:5000/api/auth/students/dept?department=${department}&year=${year}`, 
            { withCredentials: true }
          );
          setStudents(response.data); // Assume response.data contains an array of students
        } catch (err) {
          console.error('Error fetching students:', err);
          setError('Failed to fetch students. Please try again later.');
        } finally {
          setLoading(false);
        }
      } else {
        setError('Both department and year parameters are required.');
        setLoading(false);
      }
    };

    fetchStudents();
  }, [location.search]); // Run the effect when the query parameters change

  if (loading) {
    return <p>Loading students...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Students in {new URLSearchParams(location.search).get('department')} - {new URLSearchParams(location.search).get('year')}</h1>
      {students.length > 0 ? (
        <ul>
          {students.map(student => (
            <li key={student.id}> {/* Assuming each student has a unique id */}
              <h2>{student.name}</h2>
              <p>Age: {student.age}</p>
              <p>Email: {student.email}</p>
              <p>Department: {student.department}</p>
              <p>Year: {student.year}</p>
              <p>GPA: {student.gpa}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No students found for the selected department and year.</p>
      )}
    </div>
  );
};

export default FilteredStudents;
