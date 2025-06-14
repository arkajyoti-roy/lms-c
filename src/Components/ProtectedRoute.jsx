// import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserDetails } from '../utils/useUserDetails';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading, isError } = useUserDetails();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !user || !allowedRoles.includes(user.role)) {
    // Redirect to the main page if unauthorized
    const redirectPath = user?.role === 'instructor' ? '/admin/dashboard' : '/';
    return <Navigate to={redirectPath} />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;