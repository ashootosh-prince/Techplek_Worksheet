import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-2">Unauthorized Access</h2>
        <p className="text-gray-600 mb-6">You do not have permission to view this page.</p>
        <Link 
          to="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
