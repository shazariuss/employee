import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './MainLayout';
import EmployeeForm from './EmployeeForm';
import EmployeeSearch from './EmployeeSearch';
import EditEmployeeForm from './EditEmployeeForm';
import './index.css';
import EmployeeDashboard from './EmployeeDashboard';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<EmployeeDashboard />} />
          <Route path="/registerForm" element={<EmployeeForm />} />
          <Route path="/search" element={<EmployeeSearch />} />
          <Route path="/edit/:id" element={<EditEmployeeForm />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;