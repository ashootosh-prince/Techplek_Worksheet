import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome to the Home Page!</h2>
      <p>Only authenticated users can see this content.</p>
    </div>
  );
};

export default Home;
