import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateMembershipForm = () => {
  const [formData, setFormData] = useState({
    membershipNumber: '',
    startDate: '',
    endDate: '',
    membershipExtension: '',
    membershipRemove: false,
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
      const response = await axios.put('http://localhost:3001/api/v1/admin/updatemembership', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Form submitted:', response.data);
      toast.success('Membership updated successfully.');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Membership number not found');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Update Membership</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="membershipNumber" className="block text-sm font-medium text-gray-700">Membership Number</label>
                <input
                  type="text"
                  id="membershipNumber"
                  name="membershipNumber"
                  value={formData.membershipNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  min={new Date().toISOString().split('T')[0]}
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  min={formData.startDate}
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Membership Extension</label>
              <div className="mt-2 space-y-2">
                {['Six Months', 'One Year', 'Two Years'].map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      id={option.toLowerCase().replace(' ', '-')}
                      name="membershipExtension"
                      type="radio"
                      value={option}
                      checked={formData.membershipExtension === option}
                      onChange={handleInputChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label
                      htmlFor={option.toLowerCase().replace(' ', '-')}
                      className="ml-3 block text-sm font-medium text-gray-700"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mt-2">
                <div className="flex items-center">
                  <input
                    id="membershipRemove"
                    name="membershipRemove"
                    type="checkbox"
                    checked={formData.membershipRemove}
                    onChange={handleInputChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label htmlFor="membershipRemove" className="ml-3 block text-sm font-medium text-gray-700">
                    Remove Membership
                  </label>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update Membership
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateMembershipForm;
