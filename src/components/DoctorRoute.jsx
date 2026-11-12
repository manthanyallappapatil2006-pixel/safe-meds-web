
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const DoctorRoute = ({ children }) => {
  const { user } = useApp();

  if (!user) {
    return <Navigate to="/doctor-login" replace />;
  }

  if (user.role !== 'doctor' || !user.doctorId) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default DoctorRoute;
