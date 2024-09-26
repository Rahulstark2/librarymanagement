import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const OverdueReturns = () => {
  const [overdueItems, setOverdueItems] = useState([]);
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      const fetchOverdueReturns = async () => {
        const token = localStorage.getItem('token');
        const result = await axios.get('http://localhost:3001/api/v1/reports/overdue-returns', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(result.data);
        
        setOverdueItems(result.data);
      };

      fetchOverdueReturns();

      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  const tableHeaders = [
    'Serial No Book/Movie',
    'Name of Book/Movie',
    'Membership Id',
    'Date of Issue',
    'Date of Return',
    'Fine Calculations',
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center text-indigo-800 mb-4">Overdue Returns</h2>
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
            {overdueItems.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2 text-gray-700">{item.serialNumber}</td>
                <td className="border px-4 py-2 text-gray-700">
                  <div className="flex">
                    <div className="mr-1">{item.name}</div>
                    <div>- ({item.type})</div>
                  </div>
                </td>
                <td className="border px-4 py-2 text-gray-700">{item.membershipId}</td>
                <td className="border px-4 py-2 text-gray-700">{item.issueDate}</td>
                <td className="border px-4 py-2 text-gray-700">{item.returnDate}</td>
                <td className="border px-4 py-2 text-gray-700">₹{item.fine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OverdueReturns;
