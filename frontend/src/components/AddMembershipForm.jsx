import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddMembershipForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactName: '',
    contactAddress: '',
    contactNumber: '',
    aadharCardNo: '',
    startDate: '',
    endDate: '',
    membershipType: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:3001/api/v1/admin/addmembership', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Form submitted:', response.data);
      toast.success(`Membership added successfully. Membership number: ${response.data.membershipNumber}`);
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response && error.response.status === 400 && error.response.data.message === 'A membership with this Aadhar card number already exists') {
        toast.error('Membership already added. If you want to modify then click Update membership');
      } else {
        toast.error('Error adding membership');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Add Membership</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className="mt-1 border border-black block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className="mt-1 border border-black  block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">Contact Name</label>
                <input type="text" id="contactName" name="contactName" value={formData.contactName} onChange={handleInputChange} className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div>
                <label htmlFor="contactAddress" className="block text-sm font-medium text-gray-700">Contact Address</label>
                <input type="text" id="contactAddress" name="contactAddress" value={formData.contactAddress} onChange={handleInputChange} className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input type="number" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>

              <div>
                <label htmlFor="aadharCardNo" className="block text-sm font-medium text-gray-700">Aadhar Card No</label>
                <input type="text" id="aadharCardNo" name="aadharCardNo" value={formData.aadharCardNo} onChange={handleInputChange} className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                <input type="date" min={new Date().toISOString().split('T')[0]} id="startDate" name="startDate" value={formData.startDate} onChange={handleInputChange} className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                <input type="date"   min={formData.startDate} id="endDate" name="endDate" value={formData.endDate} onChange={handleInputChange} className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Membership Type</label>
              <div className="mt-2 space-y-2">
                {['Six Months', 'One Year', 'Two Years'].map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      id={option.toLowerCase().replace(' ', '-')}
                      name="membershipType"
                      type="radio"
                      value={option}
                      checked={formData.membershipType === option}
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
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Add Membership
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMembershipForm;
