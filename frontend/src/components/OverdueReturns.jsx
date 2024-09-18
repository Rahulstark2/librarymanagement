import React from 'react';

const OverdueReturns = () => {
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
            {/* Sample empty rows */}
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border px-4 py-2 text-gray-700">{index + 1}</td>
                <td className="border px-4 py-2 text-gray-700">Book/Movie Name {index + 1}</td>
                <td className="border px-4 py-2 text-gray-700">Membership {1000 + index}</td>
                <td className="border px-4 py-2 text-gray-700">01-09-2024</td>
                <td className="border px-4 py-2 text-gray-700">10-09-2024</td>
                <td className="border px-4 py-2 text-gray-700">₹50.00</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OverdueReturns;
