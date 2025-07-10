import { useState, useEffect } from "react";
import { fetchEquipmentList } from "../../api/axios";
import { Edit, Trash2, Plus, Loader2, Search, ChevronDown, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProductTypeList() {
    const [equipmentTypes, setEquipmentTypes] = useState([]);
    const [filteredTypes, setFilteredTypes] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchEquipmentList();
                setEquipmentTypes(data);
                setFilteredTypes(data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch product types");
                setTimeout(() => setError(null), 5000);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let result = equipmentTypes;
        
        if (searchTerm) {
            result = result.filter(item => 
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.equipment_type?.type && item.equipment_type.type.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        
        setFilteredTypes(sortItems(result));
    }, [searchTerm, equipmentTypes, sortConfig]);

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortItems = (items) => {
        return [...items].sort((a, b) => {
            const aValue = sortConfig.key.includes(".") 
                ? sortConfig.key.split(".").reduce((o, i) => o[i], a)
                : a[sortConfig.key];
            const bValue = sortConfig.key.includes(".") 
                ? sortConfig.key.split(".").reduce((o, i) => o[i], b)
                : b[sortConfig.key];

            if (aValue < bValue) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    };

    const handleAddProduct = () => {
        navigate("/equipment-type-form");
    };

    const handleEdit = (id) => {
        // Edit product logic here
        console.log(`Edit product with id: ${id}`);
    };

    const handleDelete = (id) => {
        // Delete product logic here
        console.log(`Delete product with id: ${id}`);
    };

    const SortIndicator = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) return null;
        return (
            <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${
                sortConfig.direction === "desc" ? "rotate-180" : ""
            }`} />
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Inventory</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage your product types and stock levels
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <X className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                            </button>
                        )}
                    </div>
                    <button 
                        onClick={handleAddProduct}
                        className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium whitespace-nowrap shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Status Messages */}
            {error && (
                <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-lg flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="flex-grow">
                        <p className="font-medium">Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                    <button 
                        onClick={() => setError(null)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-300 rounded-lg flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="flex-grow">
                        <p className="font-medium">Success</p>
                        <p className="text-sm">{success}</p>
                    </div>
                    <button 
                        onClick={() => setSuccess(null)}
                        className="text-green-500 hover:text-green-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <Loader2 className="w-8 h-8 text-pink-500 animate-spin mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">Loading product inventory...</p>
                </div>
            ) : (
                /* Product Types Table */
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Image
                                    </th>
                                    <th 
                                        scope="col" 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("name")}
                                    >
                                        <div className="flex items-center">
                                            Name
                                            <SortIndicator columnKey="name" />
                                        </div>
                                    </th>
                                    <th 
                                        scope="col" 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("equipment_type.type")}
                                    >
                                        <div className="flex items-center">
                                            Category
                                            <SortIndicator columnKey="equipment_type.type" />
                                        </div>
                                    </th>
                                    <th 
                                        scope="col" 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("stock")}
                                    >
                                        <div className="flex items-center">
                                            Stock
                                            <SortIndicator columnKey="stock" />
                                        </div>
                                    </th>
                                    <th 
                                        scope="col" 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("unit_cost")}
                                    >
                                        <div className="flex items-center">
                                            Unit Cost
                                            <SortIndicator columnKey="unit_cost" />
                                        </div>
                                    </th>
                                    <th 
                                        scope="col" 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("price")}
                                    >
                                        <div className="flex items-center">
                                            Price
                                            <SortIndicator columnKey="price" />
                                        </div>
                                    </th>
                                    <th 
                                        scope="col" 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort("purchases")}
                                    >
                                        <div className="flex items-center">
                                            Purchases
                                            <SortIndicator columnKey="purchases" />
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredTypes.length > 0 ? (
                                    filteredTypes.map((type) => (
                                        <tr key={type.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-600">
                                                    {type.image ? (
                                                        <img 
                                                            className="h-full w-full object-cover" 
                                                            src={type.image} 
                                                            alt={type.name} 
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.parentElement.innerHTML = `
                                                                    <div class="h-full w-full flex items-center justify-center text-gray-400 dark:text-gray-300">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                        </svg>
                                                                    </div>
                                                                `;
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-gray-400 dark:text-gray-300">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {type.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {type.equipment_type?.type || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`text-sm ${
                                                    type.stock <= 5 ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
                                                }`}>
                                                    {type.stock || 0}
                                                    {type.stock <= 5 && (
                                                        <span className="ml-1 text-xs text-red-500 dark:text-red-400">(Low stock)</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    ₦{type.unit_cost?.toLocaleString() || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-green-600 dark:text-green-400">
                                                    ₦{type.price?.toLocaleString() || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {type.purchases || 0}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button 
                                                        onClick={() => handleEdit(type.id)}
                                                        className="text-pink-600 dark:text-pink-400 hover:text-pink-900 dark:hover:text-pink-300 p-1.5 rounded-md hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(type.id)}
                                                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <Search className="w-12 h-12 text-gray-400 mb-3" />
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                                    No products found
                                                </h3>
                                                <p className="text-gray-500 dark:text-gray-400">
                                                    {searchTerm ? 'Try adjusting your search' : 'No products available in inventory'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination would go here */}
                    {filteredTypes.length > 0 && (
                        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTypes.length}</span> of{' '}
                                <span className="font-medium">{filteredTypes.length}</span> products
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                                    disabled
                                >
                                    Previous
                                </button>
                                <button
                                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                                    disabled
                                >
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

export default ProductTypeList;