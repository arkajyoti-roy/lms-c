// import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserDetails } from '../utils/useUserDetails';
import PropTypes from 'prop-types';

const PublicRoute = ({ children }) => {
  const { user, isLoading } = useUserDetails();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    // Redirect to the dashboard or home page if the user is authenticated
    const redirectPath = user.role === 'instructor' ? '/admin/dashboard' : '/';
    return <Navigate to={redirectPath} />;
  }

  return children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;