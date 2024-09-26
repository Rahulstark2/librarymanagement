import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SearchOptions = [
  { value: 'book', label: 'Book' },
  { value: 'movie', label: 'Movie' },
];

const BookIssue = () => {
  const [searchType, setSearchType] = useState(null);
  const [bookOptions, setBookOptions] = useState([]);
  const [movieOptions, setMovieOptions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [authorOrDirector, setAuthorOrDirector] = useState('');
  const [issueDate, setIssueDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date(new Date().setDate(new Date().getDate() + 15)));
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (issueDate) {
      
      const updatedReturnDate = new Date(issueDate);
      updatedReturnDate.setDate(updatedReturnDate.getDate() + 15);
      setReturnDate(updatedReturnDate);
    }
  }, [issueDate]);

  const fetchSearchResults = async (query) => {
    if (!query || typeof query !== 'string') return;

    try {
      const response = await axios.get('http://localhost:3001/api/v1/transaction/search', {
        params: {
          itemQuery: query,
          type: searchType?.value,
        },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (searchType?.value === 'book') {
        setBookOptions(response.data.books.map(book => ({
          value: book._id?.toString() || '',
          label: book.name?.toString() || '',
          author: book.author?.toString() || ''
        })).filter(option => option.value && option.label));
      } else if (searchType?.value === 'movie') {
        setMovieOptions(response.data.movies.map(movie => ({
          value: movie._id?.toString() || '',
          label: movie.name?.toString() || '',
          director: movie.director?.toString() || ''
        })).filter(option => option.value && option.label));
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      toast.error(`Error fetching ${searchType?.label || 'search'} results`);
    }
  };

  const handleItemChange = (selectedOption) => {
    setSelectedItem(selectedOption);
    if (searchType?.value === 'book') {
      setAuthorOrDirector(selectedOption?.author || '');
    } else if (searchType?.value === 'movie') {
      setAuthorOrDirector(selectedOption?.director || '');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchType || !selectedItem) {
      toast.error('Please select a book/movie.');
      return;
    }
  
    try {
      const response = await axios.post(`http://localhost:3001/api/v1/transaction/issue`, {
        itemId: selectedItem.value,
        issueDate,
        returnDate,
        remarks,
        type: searchType.value,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
  
      toast.success(`${searchType.label} issued successfully!`);
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.error === 'Item is already issued') {
        toast.error(`${searchType.label} is already issued`);
      } else if (error.response && error.response.status === 400 && error.response.data.error === 'Item is not available for issue') {
        toast.error(`${searchType.label} is not available for issue`);
      } else if (error.response && error.response.status === 403 && error.response.data.error === 'User is not active') {
        toast.error('User is not active');
      } else {
        console.error('Error issuing item:', error);
        toast.error(`Error issuing ${searchType.label}`);
      }
    }
  };
  
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Issue Book or Movie</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="searchType" className="block text-sm font-medium text-gray-700">Select Type</label>
              <Select
                id="searchType"
                options={SearchOptions}
                value={searchType}
                onChange={(selectedOption) => {
                  setSearchType(selectedOption);
                  setSelectedItem(null);
                  setAuthorOrDirector('');
                }}
                className="mt-1 block w-full"
                placeholder="Select Book or Movie"
                isClearable={true} 
              />
            </div>
            {searchType && (
              <>
                <div>
                  <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
                    {searchType.value === 'book' ? 'Enter Book Name' : 'Enter Movie Name'}
                  </label>
                  <Select
                    id="itemName"
                    options={searchType.value === 'book' ? bookOptions : movieOptions}
                    value={selectedItem}
                    onInputChange={(inputValue) => {
                      fetchSearchResults(inputValue);
                    }}
                    onChange={handleItemChange}
                    className="mt-1 block w-full"
                    placeholder={searchType.value === 'book' ? 'Search Book' : 'Search Movie'}
                    isClearable={true}  
                  />
                </div>
                <div>
                  <label htmlFor="authorOrDirector" className="block text-sm font-medium text-gray-700">
                    {searchType.value === 'book' ? 'Author' : 'Director'}
                  </label>
                  <input
                    type="text"
                    id="authorOrDirector"
                    value={authorOrDirector}
                    disabled
                    className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-4"
                  />
                </div>
                <div>
                  <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">Issue Date</label>
                  <DatePicker
                    id="issueDate"
                    selected={issueDate}
                    onChange={date => setIssueDate(date)}
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-4"
                  />
                </div>
                <div>
                  <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">Return Date</label>
                  <DatePicker
                    id="returnDate"
                    selected={returnDate}
                    onChange={date => setReturnDate(date)}
                    className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-4"
                    disabled
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
              </>
            )}
            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Issue
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookIssue;