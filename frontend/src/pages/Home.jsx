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
  const userRole = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const adminActions = [
    { icon: Wrench, title: 'Maintenance', to: '/adminhome/adminmaintenance' },
    { icon: FileText, title: 'Reports', to: '/adminhome/reports' },
    { icon: ArrowLeftRight, title: 'Transactions', to: '/adminhome/transactions' },
  ];

  const userActions = [
    { icon: FileText, title: 'Reports', to: '/userhome/reports' },
    { icon: ArrowLeftRight, title: 'Transactions', to: '/userhome/transactions' },
  ];

  const actions = userRole === 'admin' ? adminActions : userActions;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col justify-center items-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4">
          Library Management System
        </h1>
        <p className="text-xl text-indigo-700">Select an action to proceed</p>
      </div>
      <div className="flex flex-wrap justify-center gap-8 w-full max-w-4xl">
        {actions.map((action, index) => (
          <ActionButton key={index} {...action} />
        ))}
      </div>
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