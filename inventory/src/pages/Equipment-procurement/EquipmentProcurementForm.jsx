import { useEffect, useState } from "react";
import { fetchSuppliersList, fetchEquipmentList, createProcurement } from "../../api/axios";
import { MdEdit, MdDelete } from "react-icons/md";


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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [equipmentData, suppliersData] = await Promise.all([
          fetchEquipmentList(),
          fetchSuppliersList()
        ]);
        setEquipmentTypes(equipmentData);
        setSuppliers(suppliersData);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEquipmentChange = (e) => {
    const { name, value } = e.target;
    setEquipmentPanel(prev => {
      const newData = { ...prev.data, [name]: value };
      
      // Auto-calculate total cost when quantity or unit cost changes
      if (name === "quantity" || name === "unit_cost") {
        const quantity = name === "quantity" ? value : prev.data.quantity;
        const unitCost = name === "unit_cost" ? value : prev.data.unit_cost;
        return {
          ...prev,
          data: {
            ...newData,
            total_cost_equipment: (parseFloat(quantity) * parseFloat(unitCost)) || 0
          }
        };
      }
      return { ...prev, data: newData };
    });
  };

  const addSerialNumber = () => {
    if (equipmentPanel.data.current_serial_number.trim()) {
      setEquipmentPanel(prev => ({
        ...prev,
        data: {
          ...prev.data,
          serial_numbers: [...prev.data.serial_numbers, prev.data.current_serial_number.trim()],
          current_serial_number: "",
        }
      }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && equipmentPanel.data.current_serial_number.trim()) {
      e.preventDefault();
      addSerialNumber();
    }
  };

  const saveEquipment = () => {
    if (
      !equipmentPanel.data.id ||
      !equipmentPanel.data.model_number ||
      !equipmentPanel.data.unit_cost ||
      !equipmentPanel.data.quantity ||
      !equipmentPanel.data.unit
    ) {
      setError("Please fill in all required equipment details");
      return;
    }

    if (equipmentPanel.data.serial_numbers.length === 0) {
      setError("Please add at least one serial number");
      return;
    }

    const newEquipment = { ...equipmentPanel.data };
    let updatedEquipment;

    if (equipmentPanel.editIndex !== null) {
      // Editing existing equipment
      updatedEquipment = [...formData.equipment];
      updatedEquipment[equipmentPanel.editIndex] = newEquipment;
    } else {
      // Adding new equipment
      updatedEquipment = [...formData.equipment, newEquipment];
    }

    const newTotalCost = updatedEquipment.reduce(
      (sum, equipment) => sum + Number(equipment.unit_cost) * Number(equipment.quantity),
      0
    );

    setFormData({
      ...formData,
      equipment: updatedEquipment,
      total_cost: newTotalCost + Number(formData.logistics || 0) ,
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

    // closeEquipmentPanel();
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
  };

  const openEditEquipmentPanel = (index) => {
    const equipmentToEdit = formData.equipment[index];
    setEquipmentPanel({
      isOpen: true,
      data: equipmentToEdit,
      editIndex: index,
    });
  };

  useEffect(() => {
    setFormData({
      ...formData,
      total_cost: formData.equipment.reduce((sum, equipment) => sum + Number(equipment.unit_cost) * Number(equipment.quantity), 0) + Number(formData.logistics || 0),
    });
  }, [formData.logistics]);

  useEffect(() => {
    if (equipmentPanel.data.id) {
      const findModelNumber = equipmentTypes.find(
        (eq) => eq.id === Number(equipmentPanel.data.id)
      );
      if (findModelNumber) {
        setEquipmentPanel(prev => ({
          ...prev,
          data: {
            ...prev.data,
            model_number: findModelNumber.model,
          }
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
      console.log(formData);
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
      (sum, equipment) => sum + Number(equipment.unit_cost) * Number(equipment.quantity),
      0
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      {/* Main Form Content */}
      <div className={`w-full ${equipmentPanel.isOpen ? 'lg:w-2/3' : 'lg:w-full'} transition-all duration-300`}>
        <div className="p-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-pink-100 dark:bg-indigo-900/50 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold dark:text-white">New Equipment Procurement</h1>
              <p className="text-sm text-slate-500 dark:text-white">Add a new procurement record</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <form onSubmit={handleSubmit} className="divide-y divide-slate-200 dark:divide-slate-700">
              {/* Section 1: Basic Info */}
              <div className="p-5 space-y-4">
                <h2 className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-slate-600 dark:text-white">Supplier*</label>
                    <select
                      name="supplier_id"
                      value={formData.supplier_id}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:text-white"
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-slate-600 dark:text-white">Procurement Date*</label>
                    <input
                      type="date"
                      name="procurement_date"
                      value={formData.procurement_date}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-slate-600 dark:text-white">Logistics Cost</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-white">₦</span>
                      <input
                        type="number"
                        name="logistics"
                        value={formData.logistics}
                        onChange={handleChange}
                        className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-slate-600 dark:text-white">Total Cost</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-white">₦</span>
                      <input
                        type="text"
                        name="total_cost"
                        maxLength={10}
                        value={formData.total_cost ? `₦${parseFloat(formData.total_cost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
                        readOnly
                        className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Equipment List */}
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Equipment List
                  </h2>
                  <button
                    type="button"
                    onClick={openAddEquipmentPanel}
                    className="inline-flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                   {equipmentPanel.isOpen ? "Close Panel" : "Add Equipment"}
                  </button>
                </div>
                {formData.equipment.length > 0 ? (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Model</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Serial Numbers</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unit Cost</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Qty</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Cost</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {formData.equipment.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.model_number}</td>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {item.serial_numbers.slice(0, 3).map((sn, i) => (
                                  <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-bold">
                                    {sn} 
                                  </span>
                                ))}
                                {item.serial_numbers.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs">
                                    +{item.serial_numbers.length - 3} more
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">₦{parseFloat(item.unit_cost).toLocaleString()}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {item.quantity} {item.unit}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              ₦{parseFloat(item.total_cost_equipment).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              <div className="flex gap-3 items-center">
                                <button
                                  type="button"
                                  onClick={() => openEditEquipmentPanel(index)}
                                  className="cursor-pointer text-indigo-600 bg-indigo-100 p-2 rounded-2xl dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                                >
                                  <MdEdit className="w-5 h-5 hover:text-indigo-900 dark:hover:text-indigo-300 hover:scale-110 transition-all duration-300"/>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(index)}
                                  className="cursor-pointer text-red-600 bg-red-100 p-2 rounded-2xl dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                >
                                  <MdDelete className="w-5 h-5 hover:text-red-900 dark:hover:text-red-300 hover:scale-110 transition-all duration-300"/>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <p className="text-gray-500 dark:text-white">No equipment added yet</p>
                  </div>
                )}
              </div>

              {/* Form Footer */}
              <div className="p-5 bg-slate-50 dark:bg-slate-800/30 flex flex-col sm:flex-row justify-between gap-3">
                <div className="space-y-1">
                  {error && (
                    <div className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {success}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || formData.equipment.length === 0}
                  className={`px-4 py-2 text-sm font-medium rounded-lg text-white flex items-center justify-center gap-2 min-w-[120px] ${
                    isSubmitting ? "bg-pink-500 opacity-75 cursor-not-allowed" : 
                    formData.equipment.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Submit Procurement"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Equipment Side Panel */}
      <div 
        className={`fixed lg:relative inset-y-0 right-0 w-full lg:w-1/3 bg-white dark:bg-slate-800 shadow-xl transform ${
          equipmentPanel.isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0 lg:hidden'
        } transition-transform duration-300 ease-in-out z-20 border-l border-gray-200 dark:border-gray-700`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {equipmentPanel.editIndex !== null ? "Edit Equipment" : "Add Equipment"}
            </h3>
            <button
              onClick={closeEquipmentPanel}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Equipment Type*
                </label>
                <select
                  name="id"
                  value={equipmentPanel.data.id}
                  onChange={handleEquipmentChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                  disabled={equipmentPanel.editIndex !== null}
                >
                  <option value="">Select Equipment Type</option>
                  {equipmentTypes.map((eqType) => (
                    <option key={eqType.id} value={eqType.id}>
                      {eqType.name} ({eqType.equipment_type?.type || 'N/A'})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Model Number
                  </label>
                  <input
                    type="text"
                    name="model_number"
                    value={equipmentPanel.data.model_number}
                    readOnly
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-not-allowed"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Unit*
                  </label>
                  <select
                    name="unit"
                    value={equipmentPanel.data.unit}
                    onChange={handleEquipmentChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Unit Cost (₦)*
                  </label>
                  <input
                    type="number"
                    name="unit_cost"
                    value={equipmentPanel.data.unit_cost}
                    onChange={handleEquipmentChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quantity*
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={equipmentPanel.data.quantity}
                    onChange={handleEquipmentChange}
                    min="1"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total Equipment Cost (₦)
                </label>
                <input
                  type="text"
                  name="total_cost_equipment"
                  value={equipmentPanel.data.total_cost_equipment ? `₦${parseFloat(equipmentPanel.data.total_cost_equipment).toLocaleString()}` : ''}
                  readOnly
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-not-allowed"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Serial Numbers*
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="current_serial_number"
                    value={equipmentPanel.data.current_serial_number}
                    onChange={handleEquipmentChange}
                    onKeyDown={handleKeyDown}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter serial number and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addSerialNumber}
                    disabled={!equipmentPanel.data.current_serial_number.trim()}
                    className={`px-4 py-2 text-white rounded-lg transition-colors ${
                      equipmentPanel.data.current_serial_number.trim() ? "bg-pink-600 hover:bg-pink-700" : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {equipmentPanel.data.serial_numbers.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Added Serials ({equipmentPanel.data.serial_numbers.length})
                    </label>
                    {equipmentPanel.data.serial_numbers.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setEquipmentPanel(prev => ({
                          ...prev,
                          data: {
                            ...prev.data,
                            serial_numbers: []
                          }
                        }))}
                        className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 max-h-40 overflow-y-auto">
                    <div className="flex flex-wrap gap-2">
                      {equipmentPanel.data.serial_numbers.map((sn, index) => (
                        <div 
                          key={index} 
                          className="px-3 py-1 bg-white dark:bg-gray-600 rounded-full text-xs flex items-center border border-gray-200 dark:border-gray-500"
                        >
                          {sn}
                          <button
                            type="button"
                            onClick={() => {
                              setEquipmentPanel(prev => ({
                                ...prev,
                                data: {
                                  ...prev.data,
                                  serial_numbers: prev.data.serial_numbers.filter((_, i) => i !== index)
                                }
                              }));
                            }}
                            className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={closeEquipmentPanel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveEquipment}
              disabled={equipmentPanel.data.serial_numbers.length === 0}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                equipmentPanel.data.serial_numbers.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-700"
              }`}
            >
              {equipmentPanel.editIndex !== null ? "Update Equipment" : "Add Equipment"}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {equipmentPanel.isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={closeEquipmentPanel}
        />
      )}
    </div>
  );
}