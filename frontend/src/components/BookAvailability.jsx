import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SearchOptions = [
  { value: 'book', label: 'Book' },
  { value: 'movie', label: 'Movie' },
];

const BookAvailability = () => {
  const [searchType, setSearchType] = useState(null);
  const [bookOptions, setBookOptions] = useState([]);
  const [movieOptions, setMovieOptions] = useState([]);
  const [authorOptions, setAuthorOptions] = useState([]);
  const [directorOptions, setDirectorOptions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [personQuery, setPersonQuery] = useState('');
  const [availabilityResults, setAvailabilityResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const debounceTimeout = 500;

  const fetchSearchResults = async (query, personQuery) => {
    if (!query && !personQuery) return;

    try {
      const response = await axios.get('http://localhost:3001/api/v1/transaction/search', {
        params: {
          itemQuery: query,
          personQuery: personQuery,
          type: searchType.value
        },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
     

      if (searchType.value === 'book') {
        setBookOptions(response.data.books.map(book => ({ value: book.id, label: book.name })));
        setAuthorOptions(response.data.books.map(book => ({ value: book.id, label: book.author })));
      } else {
        setMovieOptions(response.data.movies.map(movie => ({ value: movie.id, label: movie.name })));
        setDirectorOptions(response.data.movies.map(movie => ({ value: movie.id, label: movie.director })));
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      toast.error(`Error fetching ${searchType.label} results`);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) fetchSearchResults(searchQuery, null);
    }, debounceTimeout);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (personQuery) fetchSearchResults(null, personQuery);
    }, debounceTimeout);

    return () => clearTimeout(delayDebounceFn);
  }, [personQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchType || (!selectedItem && !selectedPerson)) {
      toast.error('Please select search type and at least one search term (book/movie name or author/director name)');
      return;
    }

    const endpoint = searchType.value === 'book' ? 'books/availability' : 'movies/availability';
    const params = {};
    if (selectedItem) params.itemId = selectedItem.label;
    if (selectedPerson) params.personId = selectedPerson.label;
    try {
      console.log(params)
      const response = await axios.get(`http://localhost:3001/api/v1/transaction/${endpoint}`, {
        params,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
     
      const resultsArray = Array.isArray(response.data) ? response.data : [response.data];

      setAvailabilityResults(resultsArray);
      setShowResults(true);
      toast.success(`${searchType.label} availability fetched successfully`);
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error(`Error checking ${searchType.label} availability`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Check Availability</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="searchType" className="block text-sm font-medium text-gray-700">Search for</label>
              <Select
                id="searchType"
                options={SearchOptions}
                value={searchType}
                onChange={(selectedOption) => {
                  setSearchType(selectedOption);
                  setSelectedItem(null);
                  setSelectedPerson(null);
                }}
                className="mt-1 block w-full"
                placeholder="Select Book or Movie"
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
                      setSearchQuery(inputValue);
                    }}
                    onChange={(option) => {
                      setSelectedItem(option);
                      setSearchQuery('');
                    }}
                    inputValue={searchQuery}
                    className="mt-1 block w-full"
                    placeholder={searchType.value === 'book' ? 'Search Book' : 'Search Movie'}
                    isDisabled={!!selectedPerson}
                    isClearable={true}
                  />
                </div>
                <div>
                  <label htmlFor="personName" className="block text-sm font-medium text-gray-700">
                    {searchType.value === 'book' ? 'Enter Author Name' : 'Enter Director Name'}
                  </label>
                  <Select
                    id="personName"
                    options={searchType.value === 'book' ? authorOptions : directorOptions}
                    value={selectedPerson}
                    onInputChange={(inputValue) => {
                      setPersonQuery(inputValue);
                      setSelectedItem(null);
                    }}
                    onChange={(option) => {
                      setSelectedPerson(option);
                      setPersonQuery('');
                    }}
                    inputValue={personQuery}
                    className="mt-1 block w-full"
                    placeholder={searchType.value === 'book' ? 'Search Author' : 'Search Director'}
                    isDisabled={!!selectedItem}
                    isClearable={true}
                  />
                </div>
              </>
            )}
            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Check Availability
              </button>
            </div>
          </form>
        </div>
      </div>

      {showResults && (
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center text-indigo-800 mb-4">Availability Results</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-indigo-800 font-semibold border border-gray-300">Serial No</th>
                    <th className="px-4 py-2 text-indigo-800 font-semibold border border-gray-300">
                      {searchType.value === 'book' ? 'Book Name' : 'Movie Name'}
                    </th>
                    <th className="px-4 py-2 text-indigo-800 font-semibold border border-gray-300">
                      {searchType.value === 'book' ? 'Author Name' : 'Director Name'}
                    </th>
                    <th className="px-4 py-2 text-indigo-800 font-semibold border border-gray-300">Available</th>
                  </tr>
                </thead>
                <tbody>
                  {availabilityResults.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="border px-4 py-2 text-gray-700">{item.serialNumber}</td>
                      <td className="border px-4 py-2 text-gray-700">{item.name}</td>
                      <td className="border px-4 py-2 text-gray-700">{searchType.value === 'book' ? item.author : item.director}</td>
                      <td className="border px-4 py-2 text-gray-700">{item.status === 'Available' ? 'Yes' : 'No'}</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAvailability;
