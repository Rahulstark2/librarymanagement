import React from 'react';

const IssueRequests = () => {
  const tableHeaders = [
    'Membership Id',
    'Name of Book/Movie',
    'Requested Date',
    'Request Fulfilled Date',
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center text-indigo-800 mb-4">Issue Requests</h2>
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
            {/* Sample empty rows */}
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border px-4 py-2 text-gray-700">Membership {1000 + index}</td>
                <td className="border px-4 py-2 text-gray-700">Book/Movie Name {index + 1}</td>
                <td className="border px-4 py-2 text-gray-700">02-09-2024</td>
                <td className="border px-4 py-2 text-gray-700">05-09-2024</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssueRequests;
