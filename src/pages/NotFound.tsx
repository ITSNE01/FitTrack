import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 text-center">
      <h1 className="display-4 text-danger mb-3">404 - Page Not Found</h1>
      <p className="lead mb-4">Sorry, the page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  );
};

export default NotFound;
