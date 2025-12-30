import { useState, useEffect } from "react";
import {
  fetchEquipmentList,
  fetchToolList,
  fetchEquipmentByLocation,
} from "../../api/axios";
import {
  Edit,
  Trash2,
  Plus,
  Loader2,
  Search,
  X,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Filter,
  SortAsc,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function ProductTypeList({ type }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  console.log(filteredItems);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res =
          type === "tool"
            ? await fetchToolList()
            : await fetchEquipmentByLocation();
        const data = Array.isArray(res) ? res : (res?.data ?? []);

        if (type === "equipment") {
          const equipmentItems = data
            .map((item) => item.equipment_items?.[0]?.equipment)
            .filter(Boolean);
          setItems(equipmentItems);
          setFilteredItems(equipmentItems);
        } else {
          setItems(data);
          setFilteredItems(data);
        }
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to fetch product types",
        );
        setTimeout(() => setError(null), 5000);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type]);

  useEffect(() => {
    let result = items;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter((item) => {
        const nameMatch = item.name?.toLowerCase().includes(q);
        const equipmentType = item.equipment_type?.type;
        const toolType = item.tool_type?.type;
        const typeMatch =
          (equipmentType && equipmentType.toLowerCase().includes(q)) ||
          (toolType && toolType.toLowerCase().includes(q));
        return nameMatch || typeMatch;
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortConfig.key] ?? "";
        const bValue = b[sortConfig.key] ?? "";

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredItems(result);
  }, [searchTerm, items, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleEdit = (id) => {
    console.log(`Edit product with id: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete product with id: ${id}`);
  };

  const StatusMessage = ({ type, message, onClose }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`mb-6 p-4 rounded-xl border shadow-sm flex items-start gap-3 ${
        type === "error"
          ? "bg-red-50/80 dark:bg-red-900/20 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300"
          : "bg-green-50/80 dark:bg-green-900/20 border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-300"
      } backdrop-blur-sm`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {type === "error" ? (
          <AlertCircle className="h-5 w-5" />
        ) : (
          <CheckCircle className="h-5 w-5" />
        )}
      </div>
      <div className="flex-grow">
        <p className="font-semibold">
          {type === "error" ? "Error" : "Success"}
        </p>
        <p className="text-sm mt-1">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 mt-0.5 hover:scale-110 transition-transform"
      >
        <X className="h-5 w-5" />
      </button>
    </motion.div>
  );

  const TableHeader = ({ children, sortKey, className = "" }) => (
    <th
      scope="col"
      className={`px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer group transition-colors ${className}`}
      onClick={() => sortKey && handleSort(sortKey)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortKey && (
          <SortAsc
            className={`h-3 w-3 transition-transform ${
              sortConfig.key === sortKey && sortConfig.direction === "desc"
                ? "rotate-180"
                : ""
            }`}
          />
        )}
      </div>
    </th>
  );

  const StockIndicator = ({ stock }) => {
    const stockValue = stock ?? 0;
    const isLowStock = stockValue <= 5;
    const isOutOfStock = stockValue === 0;

    return (
      <div
        className={`text-sm font-medium ${
          isOutOfStock
            ? "text-red-600 dark:text-red-400"
            : isLowStock
              ? "text-amber-600 dark:text-amber-400"
              : "text-emerald-600 dark:text-emerald-400"
        }`}
      >
        <span className="inline-flex items-center gap-2">
          {stockValue}
          {isOutOfStock && (
            <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full font-medium">
              Out of stock
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full font-medium">
              Low stock
            </span>
          )}
        </span>
      </div>
    );
  };

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div className="flex-1">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
          >
            {type === "tool" ? "Tool Inventory" : "Equipment Inventory"}
          </motion.h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Manage your {type === "tool" ? "tools" : "equipment"} and track
            stock levels
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:flex-initial sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent text-sm shadow-lg backdrop-blur-sm transition-all duration-200"
              placeholder={`Search ${type === "tool" ? "tools" : "equipment"}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-full p-1 transition-colors"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
              </button>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              navigate(type === "tool" ? "/tool-form" : "/equipment-form")
            }
            className="px-6 py-3 cursor-pointer bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 flex items-center gap-2 text-sm font-semibold shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4" />
            Add New
          </motion.button>
        </div>
      </div>

      {/* Status Messages */}
      <AnimatePresence>
        {error && (
          <StatusMessage
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}
        {success && (
          <StatusMessage
            type="success"
            message={success}
            onClose={() => setSuccess(null)}
          />
        )}
      </AnimatePresence>

      {/* Loading State */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-96 rounded-2xl bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 shadow-lg backdrop-blur-sm"
        >
          <div className="relative">
            <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-4" />
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-20 blur-lg animate-pulse"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-4 text-base font-medium">
            Loading inventory...
          </p>
        </motion.div>
      ) : (
        /* Product Table */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/50 dark:bg-gray-800/50 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden backdrop-blur-sm"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50">
              <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-700/80 dark:to-gray-800/80 backdrop-blur-sm">
                <tr>
                  {type === "equipment" && (
                    <TableHeader className="w-20">Image</TableHeader>
                  )}
                  <TableHeader sortKey="name">Name</TableHeader>
                  <TableHeader>
                    {type === "equipment" ? "Category" : "Status"}
                  </TableHeader>
                  <TableHeader sortKey="stock">
                    {type === "equipment" ? "Stock" : "Loation"}
                  </TableHeader>
                  <TableHeader sortKey={type === "tool" ? "cost" : "unit_cost"}>
                    {type === "tool" ? "Cost" : "Unit Cost"}
                  </TableHeader>
                  <TableHeader sortKey="purchases">Purchases</TableHeader>
                  <TableHeader className="text-right">Actions</TableHeader>
                </tr>
              </thead>

              <tbody className="bg-white/30 dark:bg-gray-800/30 divide-y divide-gray-200/30 dark:divide-gray-700/30">
                <AnimatePresence>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-all duration-200 group"
                      >
                        {type === "equipment" && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm group-hover:shadow-md transition-shadow">
                              {item.images?.[0]?.image_path ? (
                                <img
                                  className="h-full w-full object-cover"
                                  src={`http://localhost:8000/${item.images[0].image_path}`}
                                  alt={item.name}
                                  onError={(e) => {
                                    e.target.src = "/placeholder.png";
                                    e.target.onerror = null;
                                  }}
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                                  <ImageIcon className="h-6 w-6" />
                                </div>
                              )}
                            </div>
                          </td>
                        )}

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                            {item.name}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
                            <span
                              className={`w-2 h-2 ${item.status === "used" ? "bg-green-500" : item.status === "damaged" ? "bg-red-500" : "bg-blue-500"}  rounded-full`}
                            ></span>
                            {item.equipment_type?.type || item.status || "N/A"}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {type === "equipment" ? (
                            <StockIndicator stock={item.stock} />
                          ) : (
                            <>{item.location?.name || "N/A"}</>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            ₦
                            {(
                              (type === "equipment"
                                ? item.unit_cost
                                : item.cost) || 0
                            ).toLocaleString()}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {item.purchases || 0}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(item.id)}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50/50 dark:hover:bg-pink-900/20 rounded-lg transition-all duration-200"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td
                        colSpan={type === "equipment" ? 7 : 6}
                        className="px-6 py-16 text-center"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl mb-4 shadow-inner">
                            <Search className="w-12 h-12 text-gray-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No {type === "tool" ? "tools" : "equipment"} found
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 max-w-md text-center mb-6">
                            {searchTerm
                              ? `No results found for "${searchTerm}". Try adjusting your search terms.`
                              : `Get started by adding your first ${type === "tool" ? "tool" : "equipment"} to the inventory.`}
                          </p>
                          {!searchTerm && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                navigate(
                                  type === "tool"
                                    ? "/tool-form"
                                    : "/equipment-form",
                                )
                              }
                              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 flex items-center gap-2 text-sm font-semibold shadow-lg hover:shadow-xl"
                            >
                              <Plus className="w-4 h-4" />
                              Add Your First{" "}
                              {type === "tool" ? "Tool" : "Equipment"}
                            </motion.button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredItems.length > 0 && (
            <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-700/30 border-t border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between backdrop-blur-sm">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing{" "}
                <span className="font-semibold">{filteredItems.length}</span> of{" "}
                <span className="font-semibold">{filteredItems.length}</span>{" "}
                items
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors shadow-sm">
                  Previous
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors shadow-sm">
                  Next
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default ProductTypeList;
