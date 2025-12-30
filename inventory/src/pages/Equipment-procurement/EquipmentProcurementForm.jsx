import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchSuppliersList,
  fetchEquipmentList,
  createProcurement,
  fetchEquipmentByLocation,
} from "../../api/axios";
import { MdEdit, MdDelete } from "react-icons/md";
import {
  Plus,
  X,
  ShoppingCart,
  Calendar,
  Truck,
  Calculator,
  Package,
  FileText,
  User,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Search,
  ChevronDown,
} from "lucide-react";

export default function EquipmentProcurementForm() {
  const [formData, setFormData] = useState({
    supplier_id: "",
    procurement_date: "",
    logistics: "",
    total_cost: 0,
    equipment: [],
  });

  const [equipmentPanel, setEquipmentPanel] = useState({
    isOpen: false,
    data: {
      id: "",
      serial_numbers: [],
      model_number: "",
      unit_cost: "",
      total_cost_equipment: "",
      quantity: "",
      unit: "",
      current_serial_number: "",
    },
    editIndex: null,
  });

  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Search state for equipment type dropdown
  const [equipmentSearch, setEquipmentSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [suppliersData, equipmentData] = await Promise.all([
        fetchSuppliersList(),
        fetchEquipmentList(),
      ]);
      setEquipmentTypes(equipmentData);
      setSuppliers(suppliersData);
    };
    setIsLoading(false);
    fetchData();
  }, []);

  // Filter equipment types based on search
  const filteredEquipmentTypes = equipmentTypes.filter(
    (equipment) =>
      equipment.name.toLowerCase().includes(equipmentSearch.toLowerCase()) ||
      equipment.model.toLowerCase().includes(equipmentSearch.toLowerCase()) ||
      equipment.equipment_type?.name
        .toLowerCase()
        .includes(equipmentSearch.toLowerCase()),
  );

  const handleEquipmentSelect = (equipmentId) => {
    const selectedEquipment = equipmentTypes.find(
      (eq) => eq.id === equipmentId,
    );
    setEquipmentPanel((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        id: equipmentId,
        model_number: selectedEquipment?.model || "",
      },
    }));
    setEquipmentSearch("");
    setIsDropdownOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEquipmentChange = (e) => {
    const { name, value } = e.target;
    setEquipmentPanel((prev) => {
      const newData = { ...prev.data, [name]: value };

      if (name === "unit_cost") {
        const quantity = prev.data.serial_numbers.length;
        return {
          ...prev,
          data: {
            ...newData,
            total_cost_equipment: parseFloat(value) * quantity || 0,
          },
        };
      }
      return { ...prev, data: newData };
    });
  };

  const addSerialNumber = () => {
    if (equipmentPanel.data.current_serial_number.trim()) {
      setEquipmentPanel((prev) => {
        const newSerialNumbers = [
          ...prev.data.serial_numbers,
          prev.data.current_serial_number.trim(),
        ];
        const quantity = newSerialNumbers.length;
        const unitCost = parseFloat(prev.data.unit_cost) || 0;

        return {
          ...prev,
          data: {
            ...prev.data,
            serial_numbers: newSerialNumbers,
            quantity: quantity,
            total_cost_equipment: unitCost * quantity,
            current_serial_number: "",
          },
        };
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && equipmentPanel.data.current_serial_number.trim()) {
      e.preventDefault();
      addSerialNumber();
    }
  };

  const saveEquipment = () => {
    if (
      !equipmentPanel.data.id ||
      !equipmentPanel.data.model_number ||
      !equipmentPanel.data.unit_cost ||
      !equipmentPanel.data.serial_numbers.length ||
      !equipmentPanel.data.unit
    ) {
      setError("Please fill in all required equipment details");
      return;
    }

    const quantity = equipmentPanel.data.serial_numbers.length;
    const newEquipment = {
      ...equipmentPanel.data,
      quantity: quantity,
      total_cost_equipment:
        parseFloat(equipmentPanel.data.unit_cost) * quantity,
    };

    let updatedEquipment;
    if (equipmentPanel.editIndex !== null) {
      updatedEquipment = [...formData.equipment];
      updatedEquipment[equipmentPanel.editIndex] = newEquipment;
    } else {
      updatedEquipment = [...formData.equipment, newEquipment];
    }

    const newTotalCost = updatedEquipment.reduce(
      (sum, equipment) =>
        sum +
        Number(equipment.unit_cost) * Number(equipment.serial_numbers.length),
      0,
    );

    setFormData({
      ...formData,
      equipment: updatedEquipment,
      total_cost: newTotalCost + Number(formData.logistics || 0),
    });

    setEquipmentPanel({
      isOpen: true,
      data: {
        id: "",
        serial_numbers: [],
        model_number: "",
        unit_cost: "",
        total_cost_equipment: "",
        quantity: "",
        unit: "",
        current_serial_number: "",
      },
      editIndex: null,
    });
  };

  const closeEquipmentPanel = () => {
    setEquipmentPanel({
      isOpen: false,
      data: {
        id: "",
        serial_numbers: [],
        model_number: "",
        unit_cost: "",
        total_cost_equipment: "",
        quantity: "",
        unit: "",
        current_serial_number: "",
      },
      editIndex: null,
    });
    setError(null);
    setEquipmentSearch("");
    setIsDropdownOpen(false);
  };

  const openAddEquipmentPanel = () => {
    setEquipmentPanel({
      isOpen: !equipmentPanel.isOpen,
      data: {
        id: "",
        serial_numbers: [],
        model_number: "",
        unit_cost: "",
        total_cost_equipment: "",
        quantity: "",
        unit: "",
        current_serial_number: "",
      },
      editIndex: null,
    });
    setEquipmentSearch("");
    setIsDropdownOpen(false);
  };

  const openEditEquipmentPanel = (index) => {
    const equipmentToEdit = formData.equipment[index];
    setEquipmentPanel({
      isOpen: true,
      data: equipmentToEdit,
      editIndex: index,
    });
    setEquipmentSearch("");
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    setFormData({
      ...formData,
      total_cost:
        formData.equipment.reduce(
          (sum, equipment) =>
            sum +
            Number(equipment.unit_cost) *
              Number(equipment.serial_numbers.length),
          0,
        ) + Number(formData.logistics || 0),
    });
  }, [formData.logistics]);

  useEffect(() => {
    if (equipmentPanel.data.id) {
      const findModelNumber = equipmentTypes.find(
        (eq) => eq.id === Number(equipmentPanel.data.id),
      );
      if (findModelNumber) {
        setEquipmentPanel((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            model_number: findModelNumber.model,
          },
        }));
      }
    }
  }, [equipmentPanel.data.id, equipmentTypes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      await createProcurement(formData);
      setSuccess("Procurement created successfully!");
      setFormData({
        supplier_id: "",
        procurement_date: "",
        logistics: "",
        total_cost: 0,
        equipment: [],
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create procurement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (index) => {
    const updatedEquipment = formData.equipment.filter((_, i) => i !== index);
    const newTotalCost = updatedEquipment.reduce(
      (sum, equipment) =>
        sum +
        Number(equipment.unit_cost) * Number(equipment.serial_numbers.length),
      0,
    );
    setFormData({
      ...formData,
      equipment: updatedEquipment,
      total_cost: newTotalCost + Number(formData.logistics || 0),
    });
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading procurement data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Main Form Content */}
      <div
        className={`w-full ${equipmentPanel.isOpen ? "lg:w-2/3" : "lg:w-full"} transition-all duration-300`}
      >
        <div className="p-4 sm:p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl shadow-lg">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                New Equipment Procurement
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Add a new procurement record
              </p>
            </div>
          </motion.div>

          {/* Success/Error Messages */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-green-800 dark:text-green-300 text-sm">
                  {success}
                </span>
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-red-800 dark:text-red-300 text-sm">
                  {error}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
          >
            <form
              onSubmit={handleSubmit}
              className="divide-y divide-gray-200 dark:divide-gray-700"
            >
              {/* Basic Information Section */}
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Basic Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      <User className="h-3 w-3 inline mr-1" />
                      Supplier*
                    </label>
                    <select
                      name="supplier_id"
                      value={formData.supplier_id}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      Procurement Date*
                    </label>
                    <input
                      type="date"
                      name="procurement_date"
                      value={formData.procurement_date}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      <Truck className="h-3 w-3 inline mr-1" />
                      Logistics Cost
                    </label>
                    <input
                      type="number"
                      name="logistics"
                      value={formData.logistics}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      <Calculator className="h-3 w-3 inline mr-1" />
                      Total Cost
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={
                        formData.total_cost
                          ? `₦${parseFloat(formData.total_cost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : ""
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Equipment List Section */}
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <Package className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                      Equipment List
                    </h2>
                    {formData.equipment.length > 0 && (
                      <span className="px-2 py-0.5 bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 rounded-full text-xs font-medium">
                        {formData.equipment.length} items
                      </span>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={openAddEquipmentPanel}
                    className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                  >
                    <Plus className="h-4 w-4" />
                    {equipmentPanel.isOpen ? "Close Panel" : "Add Equipment"}
                  </motion.button>
                </div>

                {formData.equipment.length > 0 ? (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                              Model
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                              Serial Numbers
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                              Unit Cost
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                              Qty
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                              Total Cost
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {formData.equipment.map((item, index) => (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150"
                            >
                              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {item.model_number}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex flex-wrap gap-1 max-w-xs">
                                  {item.serial_numbers
                                    .slice(0, 3)
                                    .map((sn, i) => (
                                      <span
                                        key={i}
                                        className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono border border-gray-200 dark:border-gray-600"
                                      >
                                        {sn}
                                      </span>
                                    ))}
                                  {item.serial_numbers.length > 3 && (
                                    <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs border border-gray-300 dark:border-gray-500">
                                      +{item.serial_numbers.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                                ₦{parseFloat(item.unit_cost).toLocaleString()}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {item.serial_numbers.length} {item.unit}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                                ₦
                                {parseFloat(
                                  item.total_cost_equipment,
                                ).toLocaleString()}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">
                                <div className="flex gap-1">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    type="button"
                                    onClick={() =>
                                      openEditEquipmentPanel(index)
                                    }
                                    className="p-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200 border border-blue-100 dark:border-blue-800"
                                  >
                                    <MdEdit className="w-3.5 h-3.5" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    type="button"
                                    onClick={() => handleDelete(index)}
                                    className="p-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors duration-200 border border-red-100 dark:border-red-800"
                                  >
                                    <MdDelete className="w-3.5 h-3.5" />
                                  </motion.button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
                  >
                    <Package className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No equipment added yet
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">
                      Click "Add Equipment" to get started
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Form Footer */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/30 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {formData.equipment.length > 0 ? (
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                      Ready to submit {formData.equipment.length} equipment
                      items
                    </span>
                  ) : (
                    "Add at least one equipment item to submit"
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting || formData.equipment.length === 0}
                  className={`px-6 py-2 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 min-w-[140px] justify-center ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : formData.equipment.length === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 shadow-sm hover:shadow"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      Submit Procurement
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Equipment Side Panel */}
      <AnimatePresence>
        {equipmentPanel.isOpen && (
          <>
            {/* Overlay for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 lg:hidden"
              onClick={closeEquipmentPanel}
            />

            {/* Side Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`fixed lg:relative inset-y-0 right-0 w-full lg:w-1/3 bg-white dark:bg-gray-800 shadow-xl z-20 border-l border-gray-200 dark:border-gray-700`}
            >
              <div className="h-full flex flex-col">
                {/* Panel Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {equipmentPanel.editIndex !== null
                        ? "Edit Equipment"
                        : "Add Equipment"}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      Fill in the equipment details
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeEquipmentPanel}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                </div>

                {/* Panel Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="space-y-4">
                    {/* Equipment Type - Searchable Dropdown */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Equipment Type*
                      </label>
                      <div className="relative">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-3.5 w-3.5" />
                          <input
                            type="text"
                            value={equipmentSearch}
                            onChange={(e) => setEquipmentSearch(e.target.value)}
                            onFocus={() => setIsDropdownOpen(true)}
                            placeholder="Search equipment..."
                            className="w-full pl-8 pr-8 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                            disabled={equipmentPanel.editIndex !== null}
                          />
                          <ChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-3.5 w-3.5" />
                        </div>

                        {/* Dropdown Options */}
                        <AnimatePresence>
                          {isDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                            >
                              {filteredEquipmentTypes.length > 0 ? (
                                filteredEquipmentTypes.map((equipment) => (
                                  <motion.div
                                    key={equipment.id}
                                    whileHover={{
                                      backgroundColor:
                                        "rgba(244, 114, 182, 0.1)",
                                    }}
                                    className="px-3 py-2 text-sm cursor-pointer hover:bg-pink-50 dark:hover:bg-gray-600 transition-colors duration-150"
                                    onClick={() =>
                                      handleEquipmentSelect(equipment.id)
                                    }
                                  >
                                    <div className="font-medium text-gray-900 dark:text-white">
                                      {equipment.name}
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                      Model: {equipment.model} • Type:{" "}
                                      {equipment.equipment_type?.name || "N/A"}
                                    </div>
                                  </motion.div>
                                ))
                              ) : (
                                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                                  No equipment found
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Selected Equipment Display */}
                      {equipmentPanel.data.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800"
                        >
                          <div className="text-xs text-green-800 dark:text-green-300">
                            <span className="font-medium">Selected: </span>
                            {
                              equipmentTypes.find(
                                (eq) =>
                                  eq.id === Number(equipmentPanel.data.id),
                              )?.name
                            }
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Model and Unit */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                          Model
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={equipmentPanel.data.model_number}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                          Unit*
                        </label>
                        <select
                          name="unit"
                          value={equipmentPanel.data.unit}
                          onChange={handleEquipmentChange}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                          required
                        >
                          <option value="">Select Unit</option>
                          <option value="pcs">PCS</option>
                          <option value="sets">SETS</option>
                          <option value="kgs">KG</option>
                          <option value="liters">LTR</option>
                          <option value="meters">MTR</option>
                        </select>
                      </div>
                    </div>

                    {/* Cost and Quantity */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                          Unit Cost (₦)*
                        </label>
                        <input
                          type="number"
                          name="unit_cost"
                          value={equipmentPanel.data.unit_cost}
                          onChange={handleEquipmentChange}
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                          Quantity*
                        </label>
                        <input
                          type="number"
                          readOnly
                          value={equipmentPanel.data.serial_numbers.length}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Total Cost */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Total Equipment Cost
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={
                          equipmentPanel.data.total_cost_equipment
                            ? `₦${parseFloat(equipmentPanel.data.total_cost_equipment).toLocaleString()}`
                            : ""
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed font-medium"
                      />
                    </div>

                    {/* Serial Numbers */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Serial Numbers*
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-3.5 w-3.5" />
                          <input
                            type="text"
                            name="current_serial_number"
                            value={equipmentPanel.data.current_serial_number}
                            onChange={handleEquipmentChange}
                            onKeyDown={handleKeyDown}
                            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter serial number"
                          />
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={addSerialNumber}
                          disabled={
                            !equipmentPanel.data.current_serial_number.trim()
                          }
                          className={`px-3 py-2 text-white rounded-lg transition-all duration-200 ${
                            equipmentPanel.data.current_serial_number.trim()
                              ? "bg-pink-600 hover:bg-pink-700"
                              : "bg-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <Plus className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Added Serials */}
                    {equipmentPanel.data.serial_numbers.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                            Added Serials (
                            {equipmentPanel.data.serial_numbers.length})
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              setEquipmentPanel((prev) => ({
                                ...prev,
                                data: {
                                  ...prev.data,
                                  serial_numbers: [],
                                  quantity: 0,
                                  total_cost_equipment: 0,
                                },
                              }))
                            }
                            className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                          >
                            Clear All
                          </button>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600 max-h-32 overflow-y-auto">
                          <div className="flex flex-wrap gap-1.5">
                            {equipmentPanel.data.serial_numbers.map(
                              (sn, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="px-2 py-1 bg-white dark:bg-gray-600 rounded text-xs flex items-center gap-1.5 border border-gray-200 dark:border-gray-500"
                                >
                                  <span className="font-mono">{sn}</span>
                                  <motion.button
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.8 }}
                                    type="button"
                                    onClick={() => {
                                      setEquipmentPanel((prev) => {
                                        const newSerialNumbers =
                                          prev.data.serial_numbers.filter(
                                            (_, i) => i !== index,
                                          );
                                        const quantity =
                                          newSerialNumbers.length;
                                        const unitCost =
                                          parseFloat(prev.data.unit_cost) || 0;
                                        return {
                                          ...prev,
                                          data: {
                                            ...prev.data,
                                            serial_numbers: newSerialNumbers,
                                            quantity: quantity,
                                            total_cost_equipment:
                                              unitCost * quantity,
                                          },
                                        };
                                      });
                                    }}
                                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                  >
                                    <X className="h-2.5 w-2.5" />
                                  </motion.button>
                                </motion.div>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Panel Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 flex justify-end gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={closeEquipmentPanel}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={saveEquipment}
                    disabled={equipmentPanel.data.serial_numbers.length === 0}
                    className={`px-4 py-2 text-white text-sm rounded-lg transition-all duration-200 ${
                      equipmentPanel.data.serial_numbers.length === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                    }`}
                  >
                    {equipmentPanel.editIndex !== null
                      ? "Update Equipment"
                      : "Add Equipment"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
