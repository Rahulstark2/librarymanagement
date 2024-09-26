import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateBookForm = () => {
  const [formData, setFormData] = useState({
    type: 'Book',
    name: '',
    serialNo: '',
    status: 'Available',
    date: '',
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
    try {
      console.log(formData)
      const response = await axios.put('http://localhost:3001/api/v1/admin/updatebookmovie', formData, {
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
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Update Book/Movie</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <div className="mt-2 space-y-2">
                {['Book', 'Movie'].map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      id={option.toLowerCase()}
                      name="type"
                      type="radio"
                      value={option}
                      checked={formData.type === option}
                      onChange={handleInputChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label htmlFor={option.toLowerCase()} className="ml-3 block text-sm font-medium text-gray-700">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {formData.type} Name
              </label>
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

            <div>
              <label htmlFor="serialNo" className="block text-sm font-medium text-gray-700">
                Serial No
              </label>
              <input
                type="text"
                id="serialNo"
                name="serialNo"
                value={formData.serialNo}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
                <option value="Removed">Removed</option>
                <option value="On repair">On repair</option>
                <option value="To replace">To replace</option>
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                min={new Date().toISOString().split('T')[0]} 
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update {formData.type}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateBookForm;
