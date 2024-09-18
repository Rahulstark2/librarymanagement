import React from 'react';

const ActiveMemberships = () => {
  const tableHeaders = [
    'Membership Id',
    'Name of Member',
    'Contact Number',
    'Contact Address',
    'Aadhar Card No',
    'Start Date of Membership',
    'End Date of Membership',
    'Status',
    'Amount Pending (Fine)',
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center text-indigo-800 mb-4">Active Memberships</h2>
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
            {[...Array(4)].map((_, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border px-4 py-2 text-gray-700">Membership {index + 1}</td>
                <td className="border px-4 py-2 text-gray-700">Member Name {index + 1}</td>
                <td className="border px-4 py-2 text-gray-700">1234567890</td>
                <td className="border px-4 py-2 text-gray-700">123 Street, City</td>
                <td className="border px-4 py-2 text-gray-700">XXXX-XXXX-XXXX</td>
                <td className="border px-4 py-2 text-gray-700">Start Date {index + 1}</td>
                <td className="border px-4 py-2 text-gray-700">End Date {index + 1}</td>
                <td className="border px-4 py-2 text-gray-700">Active</td>
                <td className="border px-4 py-2 text-gray-700">₹0.00</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveMemberships;
