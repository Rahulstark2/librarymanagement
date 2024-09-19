import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookAvailability = () => {
  const [bookOptions, setBookOptions] = useState([]);
  const [authorOptions, setAuthorOptions] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  useEffect(() => {
    // Fetch books and authors options from the API
    const fetchData = async () => {
      try {
        const booksResponse = await axios.get('http://localhost:3001/api/v1/books');
        const authorsResponse = await axios.get('http://localhost:3001/api/v1/authors');
        setBookOptions(booksResponse.data.map(book => ({ value: book.id, label: book.name })));
        setAuthorOptions(authorsResponse.data.map(author => ({ value: author.id, label: author.name })));
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error fetching books and authors');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBook || !selectedAuthor) {
      toast.error('Please select both book and author');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/api/v1/books/availability`, {
        params: { bookId: selectedBook.value, authorId: selectedAuthor.value }
      });
      toast.success(`Book availability: ${response.data.available ? 'Available' : 'Not Available'}`);
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error('Error checking book availability');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6">Check Book Availability</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="bookName" className="block text-sm font-medium text-gray-700">Enter Book Name</label>
                <Select
                  id="bookName"
                  options={bookOptions}
                  value={selectedBook}
                  onChange={setSelectedBook}
                  className="mt-1 block w-full"
                  placeholder="Select Book"
                />
              </div>
              <div>
                <label htmlFor="authorName" className="block text-sm font-medium text-gray-700">Enter Author Name</label>
                <Select
                  id="authorName"
                  options={authorOptions}
                  value={selectedAuthor}
                  onChange={setSelectedAuthor}
                  className="mt-1 block w-full"
                  placeholder="Select Author"
                />
              </div>
            </div>
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
