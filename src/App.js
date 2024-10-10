import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import  Home  from './components/Home';
import Prime from "./components/Prime";
import Login from './components/Login';
import Register from './components/Register';
import NotAuthorized from './components/NotAuthorized'; 
import DeleteUser from './components/DeleteUser';
import UpdateStudent from './components/UpdateStudent';
import AssignCourse from './components/AssignCourse';
import DeleteCourse from './components/DeleteCourse';
import StudentList from './components/StudentList';
import UploadProfilePicture from './components/UploadProfilePicture';
import FilteredStudents from './components/FilteredStudents';
import { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/home', { withCredentials: true });
        setRole(response.data.role); 
      } catch (error) {
        setRole(null); 
      } finally {
        setLoading(false); 
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setRole={setRole} />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/home" element={role === 'student' ? <Home /> : <Navigate to="/not-authorized" />} />
        <Route path="/prime" element={role === 'admin' ? <Prime /> : <Navigate to="/not-authorized" />} />
        <Route path='/updatestudent' element={<UpdateStudent/>}/>
        <Route path='/uploadProfilePicture' element={<UploadProfilePicture/>}/>
        <Route path="/deleteuser" element={<DeleteUser/>}/>
        <Route path="/assignCourse" element={<AssignCourse />} />
        <Route path="/deleteCourse" element={<DeleteCourse />} />
        <Route path="/studentList" element={<StudentList />} />
        <Route path="/filterStudents" element={<FilteredStudents />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />
        <Route path="/" element={<Navigate to={role ? (role === 'admin' ? '/prime' : '/home') : '/login'} />} />
      </Routes>
    </Router>
  );
};

export default App;
