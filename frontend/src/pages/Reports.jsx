import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, LogOut } from 'lucide-react';
import ActiveIssues from '../components/ActiveIssues';
import ActiveMemberships from '../components/ActiveMemberships';
import MasterListofMovies from '../components/MasterListofMovies';
import MasterListofBooks from '../components/MasterListofBooks';
import OverdueReturns from '../components/OverdueReturns';
import IssueRequests from '../components/IssueRequests';


const SidebarItem = ({ icon: Icon, title, onItemClick }) => {
  return (
    <div className="mb-2">
      <button
        className="w-full flex items-center justify-between p-2 text-indigo-100 hover:bg-indigo-700 rounded transition-colors duration-150 ease-in-out"
        onClick={() => onItemClick(title)}
      >
        <div className="flex items-center">
          <Icon size={20} className="mr-2" />
          <span className="whitespace-normal">{title}</span>
        </div>
      </button>
    </div>
  );
};


const Reports = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const handleItemClick = (itemTitle) => {
    setSelectedItem(itemTitle);
  };

  const reportItems = [
    { icon: FileText, title: 'Active Issues' },
    { icon: FileText, title: 'Master List of Memberships' },
    { icon: FileText, title: 'Master List of Movies' },
    { icon: FileText, title: 'Master List of Books' },
    { icon: FileText, title: 'Overdue Returns' },
    { icon: FileText, title: 'Pending Issues Request' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-80 bg-indigo-800 text-indigo-100 p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-center">Reports Menu</h2>
        <nav className="flex-grow">
          {reportItems.map((item, index) => (
            <SidebarItem key={index} {...item} onItemClick={handleItemClick} />
          ))}
        </nav>
        <button
          className="w-full flex items-center p-2 text-indigo-100 hover:bg-indigo-700 rounded transition-colors duration-150 ease-in-out mt-auto"
          onClick={handleLogout}
        >
          <LogOut size={20} className="mr-2" />
          <span>Logout</span>
        </button>
      </div>
      <div className="flex-grow overflow-auto">
        {selectedItem === 'Active Issues' && <ActiveIssues />}
        {selectedItem === 'Master List of Memberships' && <ActiveMemberships />}
        {selectedItem === 'Master List of Movies' && <MasterListofMovies />}
        {selectedItem === 'Master List of Books' && <MasterListofBooks />}
        {selectedItem === 'Overdue Returns' && <OverdueReturns />}
        {selectedItem === 'Pending Issues Request' && <IssueRequests />}

        {!selectedItem && (
          <div className="h-full flex items-center justify-center">
            <p className="text-2xl text-gray-500">Select a report from the sidebar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
