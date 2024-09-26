import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const ActiveMemberships = () => {
  const [memberships, setMemberships] = useState([]);
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      const fetchMemberships = async () => {
        const token = localStorage.getItem('token');
        const result = await axios.get('http://localhost:3001/api/v1/reports/active-membership', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        console.log(result.data);
        setMemberships(result.data);
      };

      fetchMemberships();

      return () => {
        effectRan.current = true;
      };
    }
  }, []);

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
            {memberships.map((membership, index) => (
              <tr key={membership.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2 text-gray-700">{membership.membershipId}</td>
                <td className="border px-4 py-2 text-gray-700">{membership.memberName}</td>
                <td className="border px-4 py-2 text-gray-700">{membership.contactNumber}</td>
                <td className="border px-4 py-2 text-gray-700">{membership.contactAddress}</td>
                <td className="border px-4 py-2 text-gray-700">{membership.aadharCardNo}</td>
                <td className="border px-4 py-2 text-gray-700">{membership.startDate}</td>
                <td className="border px-4 py-2 text-gray-700">{membership.endDate}</td>
                <td className="border px-4 py-2 text-gray-700">{membership.status}</td>
                <td className="border px-4 py-2 text-gray-700">₹{membership.amountPending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveMemberships;
