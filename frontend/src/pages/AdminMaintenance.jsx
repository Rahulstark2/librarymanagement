import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Book, UserCog, ChevronDown, ChevronUp, Plus, Edit, LogOut } from 'lucide-react';
import UpdateMembershipForm from '../components/UpdateMembershipForm';
import AddMembershipForm from '../components/AddMembershipForm';
import AddBookForm from '../components/AddBookForm';

// SidebarItem component
const SidebarItem = ({ icon: Icon, title, subItems, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-2">
      <button
        className="w-full flex items-center justify-between p-2 text-indigo-100 hover:bg-indigo-700 rounded transition-colors duration-150 ease-in-out"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <Icon size={20} className="mr-2" />
          <span>{title}</span>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="ml-4 mt-2 space-y-2">
          {subItems.map((item, index) => (
            <button
              key={index}
              className="flex items-center p-2 text-sm text-indigo-100 hover:bg-indigo-700 rounded transition-colors duration-150 ease-in-out w-full text-left"
              onClick={() => onItemClick(item.title)}
            >
              {item.icon === 'plus' ? <Plus size={16} className="mr-2" /> : <Edit size={16} className="mr-2" />}
              <span>{item.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Main AdminMaintenance component
const AdminMaintenance = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleItemClick = (itemTitle) => {
    setSelectedItem(itemTitle);
  };

  const menuItems = [
    {
      icon: Users,
      title: 'Memberships',
      subItems: [
        { icon: 'plus', title: 'Add Membership' },
        { icon: 'edit', title: 'Update Membership' },
      ],
    },
    {
      icon: Book,
      title: 'Books/Movies',
      subItems: [
        { icon: 'plus', title: 'Add Book/Movie' },
        { icon: 'edit', title: 'Update Book/Movie' },
      ],
    },
    {
      icon: UserCog,
      title: 'User Management',
      subItems: [
        { icon: 'plus', title: 'Add User' },
        { icon: 'edit', title: 'Update User' },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-indigo-800 text-indigo-100 p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-center">Maintenance Menu</h2>
        <nav className="flex-grow">
          {menuItems.map((item, index) => (
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
        {selectedItem === 'Add Membership' && <AddMembershipForm />}
        {selectedItem === 'Update Membership' && <UpdateMembershipForm />}
        {selectedItem === 'Add Book/Movie' && <AddBookForm />}

        {/* Add other conditions for different forms/components */}
        {!selectedItem && (
          <div className="h-full flex items-center justify-center">
            <p className="text-2xl text-gray-500">Select an option from the sidebar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMaintenance;