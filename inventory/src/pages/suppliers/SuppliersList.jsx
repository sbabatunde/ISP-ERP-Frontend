import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { fetchSuppliersList, updateSupplier,deleteSupplierDetails  } from "../../api/axios";
import { CiRead } from "react-icons/ci";
import { MdEdit, MdDelete } from "react-icons/md";
import { FiDelete } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
export default function SuppliersList() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [editedSupplier, setEditedSupplier] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();
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

  const handleDelete = async (supplierId) =>{
const response  = await deleteSupplierDetails(supplierId)
console.log(response)
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
  };

 if (loading) return (
  <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 dark:bg-gray-900 dark:bg-opacity-80 z-50">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-12 w-12 text-pink-600 dark:text-pink-400 animate-spin" />
      <p className="text-gray-600 dark:text-gray-400 font-medium">Loading supplier data...</p>
    </div>
  </div>
);
  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;


  return (
    <div className="min-h-screen ">
      <div className="  bg-white dark:bg-slate-900 shadow-xl rounded-xl p-8">
      
        <h1 className="text-4xl font-extrabold text-center dark:text-white text-slate-800 mb-10">Suppliers Directory</h1>

        <input
          type="text"
          placeholder="Search by supplier name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 mb-6 rounded-[7px] border dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-slate-900 dark:text-white"
        />

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-300 dark:divide-slate-700">
            <thead className="bg-pink-200 dark:bg-slate-800">
              <tr>
                {['Name', 'Email', 'Phone', 'Address', 'Website',"Actions"].map((head) => (
                  <th key={head} className="px-4 py-3 text-left text-sm font-bold text-slate-700 dark:text-slate-200 uppercase">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier, idx) => (
                  <tr key={supplier.id || idx} className="hover:bg-pink-50 dark:hover:bg-slate-800">
                    <td className="px-4 py-4 font-semibold text-slate-700 dark:text-slate-100">{supplier.name}</td>
                    {/* <td className="px-4 py-4 text-slate-700 dark:text-slate-200">{supplier.contact_name}</td> */}
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-200">{supplier.contact_email}</td>
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-200">{supplier.contact_phone}</td>
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-200">{supplier.address || 'N/A'}</td>
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-200">{supplier.website || 'N/A'}</td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => navigate(`/suppliers-view/${supplier.id}`)} className="p-2 rounded-full bg-green-200 dark:bg-green-900/50 text-green-700 hover:scale-110">
                          <CiRead size={18} />
                        </button>
                        <button onClick={() => navigate(`/suppliers-edit/${supplier.id}`)} className="p-2 rounded-full bg-yellow-200 dark:bg-yellow-900/50 text-yellow-700 hover:scale-110">
                          <MdEdit size={18} />
                        </button>
                        <button onClick={()=>{handleDelete(supplier.id)}} className="p-2 rounded-full bg-red-200 dark:bg-red-900/50 text-red-700 hover:scale-110">
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
         <motion.div 
         initial={{ opacity: 0 }} 
         animate={{ opacity: 1 }} 
         className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
       >
         <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md shadow-xl relative border border-slate-200 dark:border-slate-700">
           <button 
             onClick={closeModal} 
             className="absolute top-5 right-5 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400 hover:text-red-500"
             aria-label="Close modal"
           >
             <FiDelete className="text-xl" />
           </button>
           
           <div className="space-y-6">
             <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white">
               Supplier Details
             </h2>
             
             <div className="space-y-4">
               <div className="flex items-start">
                 <span className="w-28 font-medium text-slate-500 dark:text-slate-400">Name:</span>
                 <span className="flex-1 font-semibold text-slate-800 dark:text-slate-100">
                   {selectedSupplier.name}
                 </span>
               </div>
               
               <div className="flex items-start">
                 <span className="w-28 font-medium text-slate-500 dark:text-slate-400">Contact:</span>
                 <span className="flex-1 text-slate-700 dark:text-slate-200">
                   {selectedSupplier.contact_name}
                 </span>
               </div>
               
               <div className="flex items-start">
                 <span className="w-28 font-medium text-slate-500 dark:text-slate-400">Email:</span>
                 <span className="flex-1 text-slate-700 dark:text-slate-200">
                   {selectedSupplier.contact_email}
                 </span>
               </div>
               
               <div className="flex items-start">
                 <span className="w-28 font-medium text-slate-500 dark:text-slate-400">Phone:</span>
                 <span className="flex-1 text-slate-700 dark:text-slate-200">
                   {selectedSupplier.contact_phone}
                 </span>
               </div>
               
               <div className="flex items-start">
                 <span className="w-28 font-medium text-slate-500 dark:text-slate-400">Address:</span>
                 <span className="flex-1 text-slate-700 dark:text-slate-200">
                   {selectedSupplier.address || 'N/A'}
                 </span>
               </div>
               
               <div className="flex items-start">
                 <span className="w-28 font-medium text-slate-500 dark:text-slate-400">Website:</span>
                 <span className="flex-1 text-slate-700 dark:text-slate-200">
                   {selectedSupplier.website ? (
                     <a 
                       href={selectedSupplier.website} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-600 dark:text-blue-400 hover:underline"
                     >
                       {selectedSupplier.website}
                     </a>
                   ) : 'N/A'}
                 </span>
               </div>
             </div>
           </div>
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
              <h2 className="text-2xl font-bold text-center mb-6 dark:text-white text-slate-800">Edit Supplier</h2>
              <input
                type="text"
                value={editedSupplier?.name || ''}
                onChange={(e) => setEditedSupplier({ ...editedSupplier, name: e.target.value })}
                className="w-full p-3 mb-4 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800  focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                placeholder="Name"
              />
              <input
                type="email"
                value={editedSupplier?.contact_email || ''}
                onChange={(e) => setEditedSupplier({ ...editedSupplier, contact_email: e.target.value })}
                className="w-full p-3 mb-4 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800  focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
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
