import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, ClipboardCheck, ClipboardX, IndianRupeeIcon, LogOut } from 'lucide-react';
import BookAvailability from '../components/BookAvailability';
import BookIssue from '../components/BookIssue';
import ReturnBook from '../components/ReturnBook';
import PayFine from '../components/PayFine';


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


const Transactions = () => {
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

  const transactionItems = [
    { icon: Book, title: 'Check Book/Movie Availability' },
    { icon: ClipboardCheck, title: 'Issue a Book/Movie' },
    { icon: ClipboardX, title: 'Return a Book/Movie' },
    { icon: IndianRupeeIcon, title: 'Fine Payment' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-80 bg-indigo-800 text-indigo-100 p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-center">Transactions Menu</h2>
        <nav className="flex-grow">
          {transactionItems.map((item, index) => (
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
        {selectedItem === 'Check Book/Movie Availability' && <BookAvailability />}
        {selectedItem === 'Issue a Book/Movie' && <BookIssue />}
        {selectedItem === 'Return a Book/Movie' && <ReturnBook />}
        {selectedItem === 'Fine Payment' && <PayFine />}

        {!selectedItem && (
          <div className="h-full flex items-center justify-center">
            <p className="text-2xl text-gray-500">Select a transaction from the sidebar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
