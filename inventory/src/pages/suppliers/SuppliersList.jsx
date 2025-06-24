import { useEffect, useState } from "react";
import { fetchSuppliersList, updateSupplier } from "../../api/axios";
import { CiRead } from "react-icons/ci";
import { MdEdit, MdDelete } from "react-icons/md";
import { FiDelete } from "react-icons/fi";
import { motion } from "framer-motion";

export default function SuppliersList() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [editedSupplier, setEditedSupplier] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await fetchSuppliersList();
        setSuppliers(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch suppliers.");
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (supplier) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleEdit = (supplier) => {
    setEditedSupplier({ ...supplier });
    setIsEditModalOpen(true);
  };

  const handleUpdateSupplier = async () => {
    try {
      const response = await updateSupplier(editedSupplier);
      setSuppliers(
        suppliers.map((s) => (s.id === editedSupplier.id ? response.data : s))
      );
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Update failed:", err.response?.data?.message || err.message);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
  };

  if (loading) return <p className="text-center mt-6 animate-pulse">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;

  return (
    <div className="min-h-screen p-6">
      <div className="  bg-white dark:bg-slate-900 shadow-xl rounded-3xl p-8">
      
        <h1 className="text-4xl font-extrabold text-center text-slate-800 dark:text-white mb-10">Suppliers Directory</h1>

        <input
          type="text"
          placeholder="Search by supplier name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 mb-6 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500"
        />

        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full divide-y divide-slate-300 dark:divide-slate-700">
            <thead className="bg-pink-200 dark:bg-slate-800">
              <tr>
                {['Name', 'Contact', 'Email', 'Phone', 'Address', 'Website',"Actions"].map((head) => (
                  <th key={head} className="px-4 py-3 text-left text-sm font-bold text-slate-700 dark:text-slate-200 uppercase">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier, idx) => (
                  <tr key={supplier.id || idx} className="hover:bg-blue-50 dark:hover:bg-slate-800">
                    <td className="px-4 py-4 font-semibold text-slate-800 dark:text-slate-100">{supplier.name}</td>
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-200">
                      {/* suggestion to remove the contact name */}
                      {supplier.contact_name}</td>
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-200">{supplier.contact_email}</td>
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-200">{supplier.contact_phone}</td>
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-200">{supplier.address || 'N/A'}</td>
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-200">{supplier.website || 'N/A'}</td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleView(supplier)} className="p-2 rounded-full bg-green-200 dark:bg-green-900/50 text-green-700 hover:scale-110">
                          <CiRead size={18} />
                        </button>
                        <button onClick={() => handleEdit(supplier)} className="p-2 rounded-full bg-yellow-200 dark:bg-yellow-900/50 text-yellow-700 hover:scale-110">
                          <MdEdit size={18} />
                        </button>
                        <button className="p-2 rounded-full bg-red-200 dark:bg-red-900/50 text-red-700 hover:scale-110">
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-500 dark:text-slate-400">No matching suppliers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* View Modal */}
        {isModalOpen && selectedSupplier && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-md shadow-lg relative">
              <button onClick={closeModal} className="absolute top-4 right-4 text-xl text-slate-400 hover:text-red-500">
                <FiDelete />
              </button>
              <h2 className="text-2xl font-bold text-center mb-4 text-slate-800 dark:text-white">Supplier Info</h2>
              <ul className="space-y-2 text-slate-700 dark:text-slate-200">
                <li><strong>Name:</strong> {selectedSupplier.name}</li>
                <li><strong>Contact:</strong> {selectedSupplier.contact_name}</li>
                <li><strong>Email:</strong> {selectedSupplier.contact_email}</li>
                <li><strong>Phone:</strong> {selectedSupplier.contact_phone}</li>
                <li><strong>Address:</strong> {selectedSupplier.address || 'N/A'}</li>
                <li><strong>Website:</strong> {selectedSupplier.website || 'N/A'}</li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-md shadow-lg relative">
              <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-xl text-slate-400 hover:text-red-500">
                <FiDelete />
              </button>
              <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-white">Edit Supplier</h2>
              <input
                type="text"
                value={editedSupplier?.name || ''}
                onChange={(e) => setEditedSupplier({ ...editedSupplier, name: e.target.value })}
                className="w-full p-3 mb-4 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Name"
              />
              <input
                type="email"
                value={editedSupplier?.contact_email || ''}
                onChange={(e) => setEditedSupplier({ ...editedSupplier, contact_email: e.target.value })}
                className="w-full p-3 mb-4 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email"
              />
              <button
                onClick={handleUpdateSupplier}
                className="w-full py-3 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 transition shadow"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
