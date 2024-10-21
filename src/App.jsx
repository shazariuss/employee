import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeForm from './EmployeeForm';
import EmployeeSearch from './EmployeeSearch';
import EditEmployeeForm from './EditEmployeeForm';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<EmployeeForm />} />
          <Route path="/search" element={<EmployeeSearch />} />
          <Route path="/edit/:id" element={<EditEmployeeForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;