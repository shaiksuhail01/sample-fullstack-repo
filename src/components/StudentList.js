import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchStudents = async () => {
      const query = new URLSearchParams(location.search); // Create an instance of URLSearchParams
      const course = query.get('course'); // Get the course from the query parameters

      if (course) {
        try {
          // Fetch students based on the course query parameter
          const response = await axios.get(`http://localhost:5000/api/auth/students?course=${course}`, { withCredentials: true });
          setStudents(response.data); // Assume response.data contains an array of students
        } catch (err) {
          console.error('Error fetching students:', err);
          setError('Failed to fetch students. Please try again later.');
        } finally {
          setLoading(false);
        }
      } else {
        setError('Course parameter is missing.');
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
      <h1>Students enrolled in {new URLSearchParams(location.search).get('course')}</h1>
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
        <p>No students found for this course.</p>
      )}
    </div>
  );
};

export default StudentList;
