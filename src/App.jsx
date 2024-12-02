import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeSearch from './pages/EmployeeSearch';
import EditEmployeeForm from './pages/EditEmployeeForm';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import './index.css';
import { AuthProvider } from './context/AuthContext';


function App() {
    return (
        <AuthProvider>     
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <MainLayout>
                                    <EmployeeDashboard />
                                </MainLayout>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/registerForm"
                        element={
                            <PrivateRoute>
                                <MainLayout>
                                    <EmployeeForm />
                                </MainLayout>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/search"
                        element={
                            <PrivateRoute>
                                <MainLayout>
                                    <EmployeeSearch />
                                </MainLayout>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/edit/:id"
                        element={
                            <PrivateRoute>
                                <MainLayout>
                                    <EditEmployeeForm />
                                </MainLayout>
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;