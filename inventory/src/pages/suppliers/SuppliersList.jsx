import { useEffect, useState } from "react";
import apiClient from "../../api/axios";

export default function SuppliersList() {
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await apiClient.get("/inventory/suppliers/list");
        console.log("API Response:", response);
        const data = response.data?.data || []; // Adjusted to handle nested data
        setSuppliers(data);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
        setError(err.response?.data?.message || "Failed to fetch suppliers.");
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  if (loading) {
    console.log("Loading suppliers...");
    return <p className="text-center mt-6 text-gray-500">Loading suppliers...</p>;
  }

  if (error) {
    console.error("Error state:", error);
    return <p className="text-center text-red-500 mt-6">{error}</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-5xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Suppliers List</h2>
        {suppliers.length === 0 ? (
          <p className="text-center text-gray-500">No suppliers available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="w-full bg-blue-500 text-white">
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Contact Name</th>
                  <th className="py-2 px-4 text-left">Email</th>
                  <th className="py-2 px-4 text-left">Phone</th>
                  <th className="py-2 px-4 text-left">Address</th>
                  <th className="py-2 px-4 text-left">Website</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b hover:bg-gray-100">
                    <td className="py-2 px-4">{supplier.name}</td>
                    <td className="py-2 px-4">{supplier.contact_name}</td>
                    <td className="py-2 px-4">{supplier.contact_email}</td>
                    <td className="py-2 px-4">{supplier.contact_phone}</td>
                    <td className="py-2 px-4">{supplier.address}</td>
                    <td className="py-2 px-4">
                      <a
                        href={supplier.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {supplier.website}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
