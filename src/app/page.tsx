import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center justify-center p-8 text-center">
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-4">
          Devconnect
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-2xl text-gray-400 mb-8">
          Your Gateway to the Global Developer Community. Build your professional profile, showcase
          your projects, and connect with fellow developers.
        </p>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors duration-300">
          Join Devconnect
        </button>
      </div>
    </div>
  );
};

export default Home;
