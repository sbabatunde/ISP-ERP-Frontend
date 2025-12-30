import { useState, useEffect } from "react";
import { fetchRepairList } from "../../api/axios"; // You'll need to create this API function
import {
  Edit,
  Trash2,
  Plus,
  Loader2,
  Search,
  X,
  AlertCircle,
  CheckCircle,
  SortAsc,
  Wrench,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function RepairList() {
  const navigate = useNavigate();
  const [repairs, setRepairs] = useState([]);
  console.log(repairs);
  const [filteredRepairs, setFilteredRepairs] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetchRepairList();
        const data = Array.isArray(res) ? res : (res?.data ?? []);
        setRepairs(data.data.data);
        setFilteredRepairs(data);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to fetch repair records",
        );
        setTimeout(() => setError(null), 5000);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = repairs;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter((repair) => {
        const equipmentMatch = repair.equipment?.name
          ?.toLowerCase()
          .includes(q);
        const descriptionMatch = repair.repair_description
          ?.toLowerCase()
          .includes(q);
        const providerMatch = repair.provider?.name?.toLowerCase().includes(q);
        return equipmentMatch || descriptionMatch || providerMatch;
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        let aValue, bValue;

        // Handle nested properties for sorting
        if (sortConfig.key.includes(".")) {
          const keys = sortConfig.key.split(".");
          aValue = keys.reduce((obj, key) => obj?.[key], a);
          bValue = keys.reduce((obj, key) => obj?.[key], b);
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

        aValue = aValue ?? "";
        bValue = bValue ?? "";

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredRepairs(result);
  }, [searchTerm, repairs, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleEdit = (id) => {
    console.log(`Edit repair with id: ${id}`);
    // Navigate to edit repair form
    navigate(`/repair-form/${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete repair with id: ${id}`);
    // Add delete confirmation and API call
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `₦${parseFloat(amount || 0).toLocaleString()}`;
  };

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div className="flex-1">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-red-600 to-pink-600 bg-clip-text text-transparent"
          >
            Repair Records
          </motion.h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Manage equipment repair history and maintenance records
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
              placeholder="Search repairs by equipment, description..."
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
            onClick={() => navigate("/repair")}
            className="px-6 py-3 cursor-pointer bg-gradient-to-r from-pink-600 to-pink-600 hover:from-pink-700 hover:to-pink-700 text-white rounded-xl transition-all duration-200 flex items-center gap-2 text-sm font-semibold shadow-lg hover:shadow-xl"
          >
            <Plus className="w-4 h-4" />
            New Repair
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
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-500 rounded-full opacity-20 blur-lg animate-pulse"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-4 text-base font-medium">
            Loading repair records...
          </p>
        </motion.div>
      ) : (
        /* Repair Table */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/50 dark:bg-gray-800/50 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden backdrop-blur-sm"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50">
              <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-700/80 dark:to-gray-800/80 backdrop-blur-sm">
                <tr>
                  <TableHeader sortKey="equipment.name">Equipment</TableHeader>
                  <TableHeader sortKey="repair_date">Repair Date</TableHeader>
                  <TableHeader sortKey="repair_cost">Cost</TableHeader>
                  <TableHeader>Description</TableHeader>
                  <TableHeader>Equipment Type</TableHeader>
                  <TableHeader className="text-right">Actions</TableHeader>
                </tr>
              </thead>

              <tbody className="bg-white/30 dark:bg-gray-800/30 divide-y divide-gray-200/30 dark:divide-gray-700/30">
                <AnimatePresence>
                  {filteredRepairs.length > 0 ? (
                    filteredRepairs.map((repair, index) => (
                      <motion.tr
                        key={repair.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-all duration-200 group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                            {repair.equipment?.name || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {repair.equipment?.model || "No model"}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatDate(repair.repair_date)}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                              {formatCurrency(repair.repair_cost)}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
                            {repair.repair_description || "No description"}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-purple-100/50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50">
                            {repair.equipment?.equipment_type?.type || "N/A"}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(repair.id)}
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50/50 dark:hover:bg-pink-900/20 rounded-lg transition-all duration-200"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(repair.id)}
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
                      <td colSpan={7} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl mb-4 shadow-inner">
                            <Wrench className="w-12 h-12 text-gray-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No repair records found
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 max-w-md text-center mb-6">
                            {searchTerm
                              ? `No results found for "${searchTerm}". Try adjusting your search terms.`
                              : "Get started by adding your first repair record."}
                          </p>
                          {!searchTerm && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => navigate("/repair")}
                              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-pink-600 hover:from-pink-700 hover:to-pink-700 text-white rounded-xl transition-all duration-200 flex items-center gap-2 text-sm font-semibold shadow-lg hover:shadow-xl"
                            >
                              <Plus className="w-4 h-4" />
                              Add Your First Repair Record
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
          {filteredRepairs.length > 0 && (
            <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-700/30 border-t border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between backdrop-blur-sm">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing{" "}
                <span className="font-semibold">{filteredRepairs.length}</span>{" "}
                of <span className="font-semibold">{repairs.length}</span>{" "}
                repair records
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

export default RepairList;
