import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const MasterListofMovies = () => {
  const [movies, setMovies] = useState([]);
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      const fetchMovies = async () => {
        const token = localStorage.getItem('token'); 
        const result = await axios.get('http://localhost:3001/api/v1/reports/movies', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log(result.data);
        setMovies(result.data);
      };

      fetchMovies();

      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  const tableHeaders = [
    'Serial No',
    'Name of Movie',
    'Director Name',
    'Status',
    'Procurement Date',
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center text-indigo-800 mb-4">Master List of Movies</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-left">
          <thead>
            <tr>
              {tableHeaders.map((header, index) => (
                <th key={index} className="px-4 py-2 text-indigo-800 font-semibold border border-gray-300">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {movies.map((movie, index) => (
              <tr key={movie.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2 text-gray-700">{index + 1}</td>
                <td className="border px-4 py-2 text-gray-700">{movie.name}</td>
                <td className="border px-4 py-2 text-gray-700">{movie.directorName}</td>
                <td className="border px-4 py-2 text-gray-700">{movie.status}</td>
                <td className="border px-4 py-2 text-gray-700">{movie.procurementDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MasterListofMovies;
