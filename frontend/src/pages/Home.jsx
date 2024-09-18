import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, FileText, ArrowLeftRight } from 'lucide-react';

const ActionButton = ({ icon: Icon, title, to }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center justify-center bg-white text-indigo-600 p-6 rounded-xl shadow-lg hover:bg-indigo-50 transition duration-300 ease-in-out w-full sm:w-56 h-48"
    >
      <Icon size={48} className="mb-4" />
      <span className="text-xl font-semibold">{title}</span>
    </button>
  );
};

const Home = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear user authentication, session, or token here
    localStorage.removeItem('token');
    navigate('/'); // Redirect to login page after logout
  };

  const actions = [
    { icon: Wrench, title: 'Maintenance', to: '/adminhome/adminmaintenance' },
    { icon: FileText, title: 'Reports', to: '/adminhome/reports' },
    { icon: ArrowLeftRight, title: 'Transactions', to: '/adminhome/admintransactions' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col justify-center items-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4">
          Library Management System
        </h1>
        <p className="text-xl text-indigo-700">Select an action to proceed</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {actions.map((action, index) => (
          <ActionButton key={index} {...action} />
        ))}
      </div>
      
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-8 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
