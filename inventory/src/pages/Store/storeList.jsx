import React, { useState, useEffect } from "react";
import {
  Loader2,
  Image as ImageIcon,
  Edit,
  Trash2,
  Plus,
  View,
  Search,
} from "lucide-react";
import { fetchStoreList } from "../../api/axios";

export default function StoreList() {
  const [storeList, setStoreList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    const fetchStoreListData = async () => {
      try {
        const data = await fetchStoreList();
        setStoreList(data);
      } finally {
        setLoading(false);
      }
    };
    fetchStoreListData();
  }, []);

  // Filter store items based on search term
  const filteredStoreList = storeList.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item?.equipment?.name?.toLowerCase().includes(searchLower) ||
      item?.equipment?.model?.toLowerCase().includes(searchLower) ||
      item?.equipment_id?.toString().includes(searchTerm)
    );
  });

  // No sorting; use filtered list directly

  const toggleRowExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="px-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Store Inventory
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your equipment inventory
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search equipment..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-96 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm p-8">
          <div className="relative mb-6">
            <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-20 blur-sm animate-pulse"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium mb-2">
            Loading inventory...
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            Fetching your equipment data
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    #
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Equipment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Model
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {Array.isArray(filteredStoreList) &&
                filteredStoreList.length > 0 ? (
                  filteredStoreList.map((item, idx) => {
                    const imagePath = item?.equipment?.images?.[0]?.image_path;
                    const imageUrl = imagePath
                      ? `http://localhost:8000/${imagePath}`
                      : null;

                    const isLowStock = item.quantity < 5;
                    const isOutOfStock = item.quantity === 0;

                    return (
                      <React.Fragment key={item.id}>
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300">
                            {idx + 1}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {item?.equipment?.name || "-"}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {item?.equipment_id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {item?.equipment?.model || "-"}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                isOutOfStock
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                  : isLowStock
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              }`}
                            >
                              {item?.quantity ?? 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                isOutOfStock
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                  : isLowStock
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              }`}
                            >
                              {isOutOfStock
                                ? "Out of Stock"
                                : isLowStock
                                  ? "Low Stock"
                                  : "In Stock"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                className="p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                className="p-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button
                                className="p-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                                title="View Details"
                                onClick={() => toggleRowExpand(item.id)}
                              >
                                <View className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {expandedRow === item.id && (
                          <tr className="bg-gray-50 dark:bg-gray-700/30">
                            <td colSpan="8" className="px-6 py-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                    Equipment Details
                                  </h4>
                                  <div className="space-y-1">
                                    <p>
                                      <span className="text-gray-500 dark:text-gray-400">
                                        Category:
                                      </span>{" "}
                                      {item.equipment?.category || "N/A"}
                                    </p>
                                    <p>
                                      <span className="text-gray-500 dark:text-gray-400">
                                        Manufacturer:
                                      </span>{" "}
                                      {item.equipment?.manufacturer || "N/A"}
                                    </p>
                                    <p>
                                      <span className="text-gray-500 dark:text-gray-400">
                                        Specifications:
                                      </span>{" "}
                                      {item.equipment?.specifications || "N/A"}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                    Inventory Information
                                  </h4>
                                  <div className="space-y-1">
                                    <p>
                                      <span className="text-gray-500 dark:text-gray-400">
                                        Last Updated:
                                      </span>{" "}
                                      {new Date().toLocaleDateString()}
                                    </p>
                                    <p>
                                      <span className="text-gray-500 dark:text-gray-400">
                                        Total Value:
                                      </span>{" "}
                                      ₦
                                      {(
                                        item.quantity *
                                        (item.equipment?.unit_cost || 0)
                                      ).toLocaleString()}
                                    </p>
                                    <p>
                                      <span className="text-gray-500 dark:text-gray-400">
                                        Status:
                                      </span>
                                      <span
                                        className={
                                          isOutOfStock
                                            ? "text-red-600 dark:text-red-400 ml-1"
                                            : isLowStock
                                              ? "text-amber-600 dark:text-amber-400 ml-1"
                                              : "text-green-600 dark:text-green-400 ml-1"
                                        }
                                      >
                                        {isOutOfStock
                                          ? "Needs Restocking"
                                          : isLowStock
                                            ? "Low Inventory"
                                            : "Adequate Stock"}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
                          <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                          No equipment found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {searchTerm
                            ? "Try adjusting your search query"
                            : "Get started by adding new equipment to your store"}
                        </p>
                        {!searchTerm && (
                          <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors">
                            <Plus className="w-4 h-4" />
                            <span>Add Equipment</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredStoreList.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
                Showing{" "}
                <span className="font-medium">{filteredStoreList.length}</span>{" "}
                results
                {searchTerm && (
                  <span>
                    {" "}
                    for "<span className="font-medium">{searchTerm}</span>"
                  </span>
                )}
              </p>

              <div className="flex items-center space-x-2">
                <button className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                <button className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
