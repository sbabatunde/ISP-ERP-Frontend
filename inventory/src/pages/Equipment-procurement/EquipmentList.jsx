import React, { useState, useEffect } from 'react';

const EquipmentList = () => {
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipmentData = async () => {
      try {
        const response = await fetch('/api/equipment');
        if (!response.ok) {
          throw new Error('Failed to fetch equipment data');
        }
        const data = await response.json();
        setEquipmentData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipmentData();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="px-4 py-2 border-b">Type</th>
              <th className="px-4 py-2 border-b">Model</th>
              <th className="px-4 py-2 border-b">Purchase Date</th>
              <th className="px-4 py-2 border-b">Unit</th>
              <th className="px-4 py-2 border-b">Cost ($)</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Image</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipmentData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{item.equipment_type_name}</td>
                <td className="px-4 py-2 border-b">{item.model}</td>
                <td className="px-4 py-2 border-b">{new Date(item.purchase_date).toLocaleDateString()}</td>
                <td className="px-4 py-2 border-b">{item.unit || 'N/A'}</td>
                <td className="px-4 py-2 border-b">${item.cost}</td>
                <td className="px-4 py-2 border-b">{item.status}</td>
                <td className="px-4 py-2 border-b">
                  {item.image ? (
                    <img src={`http://your-laravel-api.com/storage/${item.image}`} alt="Equipment" className="h-12 w-12 object-cover rounded" />
                  ) : (
                    'No Image'
                  )}
                </td>
                <td className="px-4 py-2 border-b">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2">Edit</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EquipmentList;
