import React from 'react';
import { Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 

const Landing = () => {
  const navigate = useNavigate(); 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col justify-center items-center p-4">
      <div className="text-center">
        <Book className="w-20 h-20 text-indigo-600 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-8">
          Library Management System
        </h1>
        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <button
            onClick={() => navigate('/adminlogin')} 
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg shadow-lg transition duration-300 ease-in-out w-full md:w-auto"
          >
            Admin
          </button>
          <button 
          onClick={() => navigate('/userlogin')}
          className="bg-white text-indigo-600 px-8 py-3 rounded-lg shadow-lg  transition duration-300 ease-in-out w-full md:w-auto">
            User
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
