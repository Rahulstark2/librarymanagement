import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';


const PayFine = () => {
  const [type, setType] = useState({ value: 'Book', label: 'Book' });
  const [name, setName] = useState('');
  const [authorOrDirector, setAuthorOrDirector] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [actualReturnDate, setActualReturnDate] = useState(new Date());
  const [fine, setFine] = useState('₹0'); 
  const [finePaid, setFinePaid] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const typeOptions = [
    { value: 'Book', label: 'Book' },
    { value: 'Movie', label: 'Movie' }
  ];

  useEffect(() => {
    const fetchIssueDate = async () => {
      if (!name || !authorOrDirector || !serialNumber) return;
  
      setIsLoading(true);
      try {
        const response = await axios.post('http://localhost:3001/api/v1/transaction/fetch-issue-date', {
          name,
          authorOrDirector,
          serialNumber
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
  
        setIssueDate(new Date(response.data.issueDate));
        setReturnDate(new Date(response.data.returnDate));
      } catch (error) {
        console.error('Error fetching issue date:', error);
        if (error.response && error.response.status !== 404) {
          if (error.response.data && error.response.data.error) {
            toast.error(error.response.data.error);
          } else {
            toast.error('Error fetching issue date');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchIssueDate();
  }, [name, authorOrDirector, serialNumber]);
  
  useEffect(() => {
    const calculateFine = async () => {
      if (!actualReturnDate || !returnDate) return;

      try {
        const response = await axios.post('http://localhost:3001/api/v1/transaction/calculate-fine', {
          actualReturnDate,
          returnDate
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        setFine(`₹${response.data.fine}`);
      } catch (error) {
        console.error('Error calculating fine:', error);
        toast.error('Error calculating fine');
      }
    };

    calculateFine();
  }, [actualReturnDate, returnDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!name || !authorOrDirector || !serialNumber) {
      toast.error('Please complete all required fields.');
      return;
    }
  
    if (!finePaid) {
      toast.error('Please confirm that the fine has been paid.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3001/api/v1/transaction/pay-fine', {
        type: type.value,
        name,
        authorOrDirector,
        serialNumber,
        issueDate,
        returnDate,
        actualReturnDate,
        fine: fine.replace('₹', ''),
        finePaid,
        remarks
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
  
      toast.success('Fine paid successfully!');
    } catch (error) {
      console.error('Error paying fine:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Error paying fine.');
      }
    }
  };
  
  

  const getDateMessage = () => `Please provide ${type.value === 'Book' ? 'book' : 'movie'} name, ${type.value === 'Book' ? 'author' : 'director'}, and serial number`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Pay Fine</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Select Type</label>
              <Select
                id="type"
                value={type}
                onChange={setType}
                options={typeOptions}
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                {type.value === 'Book' ? 'Enter Book Name' : 'Enter Movie Name'}
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-4"
                placeholder={type.value === 'Book' ? 'Enter Book Name' : 'Enter Movie Name'}
              />
            </div>

            <div>
              <label htmlFor="authorOrDirector" className="block text-sm font-medium text-gray-700">
                {type.value === 'Book' ? 'Enter Author' : 'Enter Director'}
              </label>
              <input
                type="text"
                id="authorOrDirector"
                value={authorOrDirector}
                onChange={(e) => setAuthorOrDirector(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-4"
                placeholder={type.value === 'Book' ? 'Enter Author Name' : 'Enter Director Name'}
              />
            </div>

            <div>
              <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">Serial No</label>
              <input
                type="text"
                id="serialNumber"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-4"
                placeholder="Enter Serial No"
              />
            </div>

            <div>
              <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">Issue Date</label>
              <input
                type="text"
                id="issueDate"
                value={isLoading ? 'Loading...' : (issueDate ? issueDate.toLocaleDateString() : getDateMessage())}
                disabled
                className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-4"
              />
            </div>

            <div>
              <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">Return Date</label>
              {isLoading ? (
                <input
                  type="text"
                  id="returnDate"
                  value="Loading..."
                  disabled
                  className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-4"
                />
              ) : returnDate ? (
                <DatePicker
                  id="returnDate"
                  selected={returnDate}
                  onChange={date => setReturnDate(date)}
                  className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-4"
                  disabled
                />
              ) : (
                <input
                  type="text"
                  id="returnDate"
                  value={getDateMessage()}
                  disabled
                  className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-4"
                />
              )}
            </div>

                            <div>
                <label htmlFor="actualReturnDate" className="block text-sm font-medium text-gray-700">Actual Return Date</label>
                <DatePicker
                    id="actualReturnDate"
                    selected={actualReturnDate}
                    onChange={date => setActualReturnDate(date)}
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-4"
                    dateFormat="dd/MM/yyyy"
                />
                </div>


            <div>
              <label htmlFor="fine" className="block text-sm font-medium text-gray-700">Fine Calculated</label>
              <input
                type="text"
                id="fine"
                value={fine}
                disabled
                className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-4"
              />
            </div>

            <div>
              <label htmlFor="finePaid" className="block text-sm font-medium text-gray-700">Fine Paid</label>
              <input
                type="checkbox"
                id="finePaid"
                checked={finePaid}
                onChange={(e) => setFinePaid(e.target.checked)}
                className="mt-1 block"
              />
            </div>

            <div>
              <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">Remarks</label>
              <textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-4"
                rows="4"
                placeholder="Enter any remarks (optional)"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md"
            >
              Pay Fine
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PayFine; 