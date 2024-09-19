import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddBookForm = () => {
  const [formData, setFormData] = useState({
    type: 'Book',
    name: '',
    procurementDate: '',
    quantity: 1,
  });
  const [authorName, setAuthorName] = useState('');
  const [directorName, setDirectorName] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'author') {
      setAuthorName(value);
    } else if (name === 'director') {
      setDirectorName(value);
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const dataToSend = {
      ...formData,
      [formData.type === 'Book' ? 'author' : 'director']: formData.type === 'Book' ? authorName : directorName,
    };
    
    try {
      console.log(dataToSend)
      const response = await axios.post('http://localhost:3001/api/v1/admin/addbookmovie', dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Form submitted:', response.data);
      toast.success(`${formData.type} added successfully.`);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(`${formData.type} already exists.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Add Book/Movie</h2>
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
                <label htmlFor="authorOrDirector" className="block text-sm font-medium text-gray-700">
                    {formData.type === 'Book' ? 'Author\'s Name' : 'Director\'s Name'}
                </label>
                <input
                    type="text"
                    id="authorOrDirector"
                    name={formData.type === 'Book' ? 'author' : 'director'}
                    value={formData.type === 'Book' ? authorName : directorName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
                </div>


            <div>
              <label htmlFor="procurementDate" className="block text-sm font-medium text-gray-700">
                Date of Procurement
              </label>
              <input
                type="date"
                id="procurementDate"
                name="procurementDate"
                value={formData.procurementDate}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity/Copies
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                min="1"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add {formData.type}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookForm;
