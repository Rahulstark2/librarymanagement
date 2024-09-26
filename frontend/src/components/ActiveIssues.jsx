import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const ActiveIssues = () => {
  const [issues, setIssues] = useState([]);
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      const fetchIssues = async () => {
        const token = localStorage.getItem('token');
        const result = await axios.get('http://localhost:3001/api/v1/reports/active-issues', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(result.data)
        
        setIssues(result.data);
      };

      fetchIssues();

      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  const tableHeaders = [
    'Serial No',
    'Name of Book/Movie',
    'Membership Id',
    'Date of Issue',
    'Date of Return',
  ];
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center text-indigo-800 mb-4">Active Issues</h2>
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
            {issues.map((issue, index) => (
              <tr key={issue.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2 text-gray-700">{issue.serialNumber}</td>
                                  <td className="border px-4 py-2 text-gray-700">
                    <div className="flex">
                      <div className="mr-1">{issue.name}</div>
                      <div>- ({issue.type})</div>
                    </div>
                  </td>

                <td className="border px-4 py-2 text-gray-700">{issue.membershipId}</td>
                <td className="border px-4 py-2 text-gray-700">{issue.issueDate}</td>
                <td className="border px-4 py-2 text-gray-700">{issue.returnDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveIssues;