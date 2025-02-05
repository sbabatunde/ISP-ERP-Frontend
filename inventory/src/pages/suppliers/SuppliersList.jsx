import { useEffect, useState } from "react";
import apiClient from "../../api/axios";
import DataTable from "react-data-table-component";
import { CiRead } from "react-icons/ci";
import { MdEdit, MdDelete } from "react-icons/md";
import { FiDelete } from "react-icons/fi";
import "../../../src/App.css";
import { motion } from "framer-motion";

export default function SuppliersList() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    {
      name: "Name",
      selector: row => row.name,
      sortable: true,
    },
    {
      name: "Contact Name",
      selector: row => row.contact_name,
      sortable: true,
    },
    {
      name: "Email",
      selector: row => row.contact_email,
    },
    {
      name: "Phone",
      selector: row => row.contact_phone,
    },
    {
      name: "Address",
      selector: row => row.address || "N/A",
    },
    {
      name: "Website",
      selector: row => row.website || "N/A",
    },
    {
      name: "Actions",
      cell: row => (
        <div className="flex space-x-3">
          <span  onClick={() => handleView(row)} className="text-green-600 cursor-pointer hover:scale-110 transition-transform "><CiRead size={20} /></span>
          <span className="text-yellow-600 cursor-pointer hover:scale-110 transition-transform"><MdEdit size={20} /></span>
          <span className="text-red-600 cursor-pointer hover:scale-110 transition-transform"><MdDelete size={20} /></span>
        </div>
      ),    
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#1F2937",
        color: "white",
        fontSize: "17px",
        fontWeight: "bold",
      },
    },
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await apiClient.get("/inventory/suppliers/list");
        const data = response.data?.data || [];
        setSuppliers(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch suppliers.");
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (supplier) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
  };

  if (loading) {
    return <p className="text-center mt-6 text-gray-500 animate-pulse">Loading suppliers...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-6">{error}</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 p-6">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl p-6">
        <motion.h1 
          className="text-3xl font-bold text-gray-800 text-center mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Supplier List
        </motion.h1>
        
        <input
          type="text"
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Search suppliers by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <DataTable 
            columns={columns} 
            data={filteredSuppliers} 
            customStyles={customStyles}
            pagination
            highlightOnHover
          />
        </motion.div>


         {/* Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0}}
          animate={{ opacity: 1, rotate:360 }}
          exit={{ opacity: 0, rotate:360 }}
          transition={{ duration: 0.4 }}
          className="fixed backdrop-blur inset-0 bg-opacity-50 flex items-center justify-center"
        >
          <div className="bg-white rounded-lg p-6 w-1/3 shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
             <FiDelete />
            </button>
            <h2 className="text-2xl font-bold mb-4">Supplier Details</h2>
            {selectedSupplier && (
              <div>
                <p><strong>Name:</strong> {selectedSupplier.name}</p>
                <p><strong>Contact Name:</strong> {selectedSupplier.contact_name}</p>
                <p><strong>Email:</strong> {selectedSupplier.contact_email}</p>
                <p><strong>Phone:</strong> {selectedSupplier.contact_phone}</p>
                <p><strong>Address:</strong> {selectedSupplier.address || "N/A"}</p>
                <p><strong>Website:</strong> {selectedSupplier.website || "N/A"}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
      </div>
    </div>
  );
}

