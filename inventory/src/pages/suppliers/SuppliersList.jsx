// import { useEffect, useState } from "react";
// import {
//   Loader2,
//   Search,
//   Plus,
//   Filter,
//   Download,
//   MoreVertical,
// } from "lucide-react";
// import {
//   fetchSuppliersList,
//   updateSupplier,
//   deleteSupplierDetails,
// } from "../../api/axios";
// import { CiRead } from "react-icons/ci";
// import { MdEdit, MdDelete } from "react-icons/md";
// import { FiDelete } from "react-icons/fi";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
//   DropdownMenuCheckboxItem,
// } from "@/components/ui/dropdown-menu";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { toast } from "sonner";

// export default function SuppliersList() {
//   const [suppliers, setSuppliers] = useState([]);
//   const [selectedSupplier, setSelectedSupplier] = useState(null);
//   const [editedSupplier, setEditedSupplier] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [supplierToDelete, setSupplierToDelete] = useState(null);
//   const [statusFilter, setStatusFilter] = useState("all");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchSuppliers = async () => {
//       try {
//         const data = await fetchSuppliersList();
//         setSuppliers(data);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to fetch suppliers.");
//         toast.error("Failed to load suppliers");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSuppliers();
//   }, []);

//   const filteredSuppliers = suppliers.filter(
//     (supplier) =>
//       supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       supplier.contact_email
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       supplier.contact_phone?.includes(searchTerm),
//   );

//   const handleView = (supplier) => {
//     setSelectedSupplier(supplier);
//     setIsModalOpen(true);
//   };

//   const handleEdit = (supplier) => {
//     setEditedSupplier({ ...supplier });
//     setIsEditModalOpen(true);
//   };

//   const handleUpdateSupplier = async () => {
//     try {
//       const response = await updateSupplier(editedSupplier);
//       setSuppliers(
//         suppliers.map((s) => (s.id === editedSupplier.id ? response.data : s)),
//       );
//       setIsEditModalOpen(false);
//       toast.success("Supplier updated successfully");
//     } catch (err) {
//       console.error(
//         "Update failed:",
//         err.response?.data?.message || err.message,
//       );
//       toast.error("Failed to update supplier");
//     }
//   };

//   const confirmDelete = (supplier) => {
//     setSupplierToDelete(supplier);
//     setDeleteDialogOpen(true);
//   };

//   const handleDelete = async () => {
//     try {
//       await deleteSupplierDetails(supplierToDelete.id);
//       setSuppliers(suppliers.filter((s) => s.id !== supplierToDelete.id));
//       setDeleteDialogOpen(false);
//       toast.success("Supplier deleted successfully");
//     } catch (err) {
//       console.error("Delete failed:", err);
//       toast.error("Failed to delete supplier");
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedSupplier(null);
//   };

//   if (loading)
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 dark:bg-gray-900 dark:bg-opacity-80 z-50">
//         <div className="flex flex-col items-center gap-3">
//           <Loader2 className="h-12 w-12 text-pink-600 dark:text-pink-400 animate-spin" />
//           <p className="text-gray-600 dark:text-gray-400 font-medium">
//             Loading supplier data...
//           </p>
//         </div>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle className="text-red-500">Error</CardTitle>
//             <CardDescription>{error}</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Button onClick={() => window.location.reload()} className="w-full">
//               Try Again
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );

//   return (
//     <div className="min-h-screen p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
//               Suppliers Directory
//             </h1>
//             <p className="text-slate-600 dark:text-slate-400 mt-2">
//               Manage your suppliers and their contact information
//             </p>
//           </div>
//           <Button
//             onClick={() => navigate("/suppliers/add")}
//             className="bg-pink-600 hover:bg-pink-700"
//           >
//             <Plus className="w-4 h-4 mr-2" />
//             Add Supplier
//           </Button>
//         </div>

//         <Card className="shadow-lg">
//           <CardHeader className="pb-3">
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//               <div className="flex-1 max-w-full">
//                 <div className="relative">
//                   <Input
//                     type="text"
//                     placeholder="Search suppliers by name, email, or phone..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-8"
//                   />
//                 </div>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="rounded-md border">
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b bg-muted/50">
//                       <th className="p-4 text-left font-medium">Name</th>
//                       <th className="p-4 text-left font-medium">Email</th>
//                       <th className="p-4 text-left font-medium">Phone</th>
//                       <th className="p-4 text-left font-medium">Address</th>
//                       <th className="p-4 text-left font-medium">Status</th>
//                       <th className="p-4 text-right font-medium">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredSuppliers.length > 0 ? (
//                       filteredSuppliers.map((supplier, idx) => (
//                         <motion.tr
//                           key={supplier.id || idx}
//                           className="border-b hover:bg-muted/30"
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ duration: 0.2, delay: idx * 0.05 }}
//                         >
//                           <td className="p-4 font-medium">{supplier.name}</td>
//                           <td className="p-4">{supplier.contact_email}</td>
//                           <td className="p-4">{supplier.contact_phone}</td>
//                           <td className="p-4">{supplier.address || "N/A"}</td>
//                           <td className="p-4">
//                             <Badge
//                               variant={
//                                 supplier.status === "active"
//                                   ? "default"
//                                   : "secondary"
//                               }
//                             >
//                               {supplier.status || "active"}
//                             </Badge>
//                           </td>
//                           <td className="p-4 text-right">
//                             <DropdownMenu>
//                               <DropdownMenuTrigger asChild>
//                                 <div>
//                                   <Button
//                                     variant="ghost"
//                                     className="h-8 w-8 p-0"
//                                   >
//                                     <MoreVertical className="h-4 w-4" />
//                                   </Button>
//                                 </div>
//                               </DropdownMenuTrigger>
//                               <DropdownMenuContent align="end">
//                                 <DropdownMenuItem
//                                   onClick={() => handleView(supplier)}
//                                 >
//                                   <CiRead className="mr-2 h-4 w-4" />
//                                   View Details
//                                 </DropdownMenuItem>
//                                 <DropdownMenuItem
//                                   onClick={() =>
//                                     navigate(`/suppliers-edit/${supplier.id}`)
//                                   }
//                                 >
//                                   <MdEdit className="mr-2 h-4 w-4" />
//                                   Edit
//                                 </DropdownMenuItem>
//                                 <DropdownMenuSeparator />
//                                 <DropdownMenuItem
//                                   className="text-red-600"
//                                   onClick={() => confirmDelete(supplier)}
//                                 >
//                                   <MdDelete className="mr-2 h-4 w-4" />
//                                   Delete
//                                 </DropdownMenuItem>
//                               </DropdownMenuContent>
//                             </DropdownMenu>
//                           </td>
//                         </motion.tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan={6} className="p-8 text-center">
//                           <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
//                             <Search className="h-12 w-12 opacity-30" />
//                             <p className="text-lg font-medium">
//                               No suppliers found
//                             </p>
//                             <p>Try adjusting your search or filters</p>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* View Modal */}
//         <AnimatePresence>
//           {isModalOpen && selectedSupplier && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//             >
//               <motion.div
//                 initial={{ scale: 0.95, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.95, opacity: 0 }}
//                 className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md shadow-xl relative border border-slate-200 dark:border-slate-700"
//               >
//                 <button
//                   onClick={closeModal}
//                   className="absolute top-5 right-5 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400 hover:text-red-500"
//                   aria-label="Close modal"
//                 >
//                   <FiDelete className="text-xl" />
//                 </button>

//                 <div className="space-y-6">
//                   <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white">
//                     Supplier Details
//                   </h2>

//                   <div className="space-y-4">
//                     <div className="flex items-start">
//                       <span className="w-28 font-medium text-slate-500 dark:text-slate-400">
//                         Name:
//                       </span>
//                       <span className="flex-1 font-semibold text-slate-800 dark:text-slate-100">
//                         {selectedSupplier.name}
//                       </span>
//                     </div>

//                     <div className="flex items-start">
//                       <span className="w-28 font-medium text-slate-500 dark:text-slate-400">
//                         Contact:
//                       </span>
//                       <span className="flex-1 text-slate-700 dark:text-slate-200">
//                         {selectedSupplier.contact_name}
//                       </span>
//                     </div>

//                     <div className="flex items-start">
//                       <span className="w-28 font-medium text-slate-500 dark:text-slate-400">
//                         Email:
//                       </span>
//                       <span className="flex-1 text-slate-700 dark:text-slate-200">
//                         {selectedSupplier.contact_email}
//                       </span>
//                     </div>

//                     <div className="flex items-start">
//                       <span className="w-28 font-medium text-slate-500 dark:text-slate-400">
//                         Phone:
//                       </span>
//                       <span className="flex-1 text-slate-700 dark:text-slate-200">
//                         {selectedSupplier.contact_phone}
//                       </span>
//                     </div>

//                     <div className="flex items-start">
//                       <span className="w-28 font-medium text-slate-500 dark:text-slate-400">
//                         Address:
//                       </span>
//                       <span className="flex-1 text-slate-700 dark:text-slate-200">
//                         {selectedSupplier.address || "N/A"}
//                       </span>
//                     </div>

//                     <div className="flex items-start">
//                       <span className="w-28 font-medium text-slate-500 dark:text-slate-400">
//                         Website:
//                       </span>
//                       <span className="flex-1 text-slate-700 dark:text-slate-200">
//                         {selectedSupplier.website ? (
//                           <a
//                             href={selectedSupplier.website}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-600 dark:text-blue-400 hover:underline"
//                           >
//                             {selectedSupplier.website}
//                           </a>
//                         ) : (
//                           "N/A"
//                         )}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Delete Confirmation Dialog */}
//         <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//               <AlertDialogDescription>
//                 This action cannot be undone. This will permanently delete the
//                 supplier "{supplierToDelete?.name}" from our records.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction
//                 onClick={handleDelete}
//                 className="bg-red-600 hover:bg-red-700"
//               >
//                 Delete
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </div>
//     </div>
//   );
// }

import React from "react";
import Tables from "@/layout/tables";
import { useState, useEffect } from "react";
import {
  fetchSuppliersList,
  updateSupplier,
  deleteSupplierDetails,
} from "../../api/axios";
import { MdReadMore } from "react-icons/md";
import { Edit } from "lucide-react";
import { MdDelete } from "react-icons/md";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function SuppliersList() {
  const [data, setData] = useState([]);
  console.log(data);
  const [loading, setLoading] = useState(false);
  async function getSuppliers() {
    try {
      setLoading(true);
      const res = await fetchSuppliersList();
      console.log(res);
      setData(res);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getSuppliers();
  }, []);

  const Header = [
    {
      key: "name",
      label: "Name",
      sortable: false,
    },
    {
      key: "contact_email",
      label: "Email",
      sortable: false,
    },
    {
      key: "contact_phone",
      label: "Phone",
      sortable: false,
    },
    {
      key: "address",
      label: "Address",
      sortable: false,
    },
  ];
  const actionItems = [
    {
      label: "View",
      icon: { name: MdReadMore, style: "text-green-500" },
      onClick: (row) => console.log("View", row),
    },
    {
      label: "Edit",
      icon: { name: Edit, style: "text-yellow-500" },
      onClick: (row) => console.log("Edit", row),
    },
    {
      label: "Delete",
      icon: { name: MdDelete, style: "text-red-500" },
      onClick: (row) => console.log("Delete", row),
      variant: "danger",
    },
  ];
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <Tables
          header={"Suppliers List"}
          description={"Manage your suppliers and their contact information"}
          data={data}
          tableHeaders={Header}
          loading={loading}
          emptyMessage="No suppliers found"
          actionItems={actionItems}
        />
      </div>
    </div>
  );
}

export default SuppliersList;
