import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserManagement = () => {
  const [formData, setFormData] = useState({
    userType: 'New User',
    name: '',
    password: '',
    status: false,
    admin: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const updatedFormData = { 
      ...formData, 
      status: formData.status ? 'active' : 'inactive' 
    };

    try {
      console.log(updatedFormData)
      const response = await axios.post('http://localhost:3001/api/v1/admin/manageuser', updatedFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Form submitted:', response.data);
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">User Management</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">User Type</label>
              <div className="mt-2 space-y-2">
                {['New User', 'Existing User'].map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      id={option.toLowerCase().replace(' ', '-')}
                      name="userType"
                      type="radio"
                      value={option}
                      checked={formData.userType === option}
                      onChange={handleInputChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label htmlFor={option.toLowerCase().replace(' ', '-')} className="ml-3 block text-sm font-medium text-gray-700">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {formData.userType === 'New User' && (
             <div>
             <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
             <input
               type="password"
               id="password"
               name="password"
               value={formData.password}
               onChange={handleInputChange}
               minLength="6"
               className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
               required
             />
           </div>
           
            )}

            <div className="flex items-center">
              <input
                id="status"
                name="status"
                type="checkbox"
                checked={formData.status}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="status" className="ml-2 block text-sm font-medium text-gray-700">
                Active
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="admin"
                name="admin"
                type="checkbox"
                checked={formData.admin}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="admin" className="ml-2 block text-sm font-medium text-gray-700">
                Admin
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Manage {formData.userType}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
