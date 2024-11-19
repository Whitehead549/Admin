import React, { useState } from 'react';
import Login from '../components/Essentials/Login';

const Registration = () => {
  const [showLogin, setShowLogin] = useState(true);

  const handleToggle = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full mx-2 relative z-10">
        {showLogin && (
          <>
            <Login />
           
          </>
        )}
      </div>
    </div>
  );
};

export default Registration;
