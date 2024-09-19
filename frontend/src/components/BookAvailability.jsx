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

  useEffect(() => {
    // Fetch book and movie options from the API
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/v1/transaction/check-availability', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        setBookOptions(response.data.books.map(book => ({ value: book.id, label: book.name })));
        setAuthorOptions(response.data.authors.map(author => ({ value: author.id, label: author.name })));
        setMovieOptions(response.data.movies.map(movie => ({ value: movie.id, label: movie.name })));
        setDirectorOptions(response.data.directors.map(director => ({ value: director.id, label: director.name })));
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error fetching books, movies, authors, and directors');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchType || !selectedItem || !selectedPerson) {
      toast.error('Please select search type, item, and author/director');
      return;
    }

    const endpoint = searchType.value === 'book' ? 'books/availability' : 'movies/availability';
    try {
      const response = await axios.get(`http://localhost:3001/api/v1/${endpoint}`, {
        params: { itemId: selectedItem.value, personId: selectedPerson.value },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success(`${searchType.label} availability: ${response.data.available ? 'Available' : 'Not Available'}`);
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error(`Error checking ${searchType.label} availability`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Check Availability</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="searchType" className="block text-sm font-medium text-gray-700">Search for</label>
              <Select
                id="searchType"
                options={SearchOptions}
                value={searchType}
                onChange={setSearchType}
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
                    onChange={setSelectedItem}
                    className="mt-1 block w-full"
                    placeholder={searchType.value === 'book' ? 'Select Book' : 'Select Movie'}
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
                    onChange={setSelectedPerson}
                    className="mt-1 block w-full"
                    placeholder={searchType.value === 'book' ? 'Select Author' : 'Select Director'}
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
    </div>
  );
};

export default BookAvailability;