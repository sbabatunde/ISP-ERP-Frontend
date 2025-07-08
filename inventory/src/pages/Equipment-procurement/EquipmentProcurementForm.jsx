import { useEffect, useState } from "react";
import { fetchSuppliersList, fetchEquipmentList, createProcurement } from "../../api/axios";

export default function EquipmentProcurementForm() {
  const [formData, setFormData] = useState({
    supplier_id: "",
    procurement_date: "",
    logistics: "",
    total_cost: 0,
    equipment: [],
  });

  const [serialNumberData, setSerialNumberData] = useState({
    id: "",
    serial_numbers: [],
    model_number: "",
    unit_cost: "",
    total_cost_equipment: "",
    quantity: "",
    unit: "",
    current_serial_number: "",
  });

  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isAddEquipmentModal, setisAddEquipmentModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditEquipmentModal, setisEditEquipmentModal] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [equipmentData, suppliersData] = await Promise.all([
          fetchEquipmentList(),
          fetchSuppliersList()
        ]);
        setEquipmentTypes(equipmentData);
        setSuppliers(suppliersData);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSerialChange = (e) => {
    setSerialNumberData({ ...serialNumberData, [e.target.name]: e.target.value });
  };

  const addSerialNumber = () => {
    if (serialNumberData.current_serial_number) {
      setSerialNumberData({
        ...serialNumberData,
        serial_numbers: [...serialNumberData.serial_numbers, serialNumberData.current_serial_number],
        current_serial_number: "",
      });
    }
  };

  const addEquipment = () => {
    if (
      serialNumberData.id &&
      serialNumberData.serial_numbers.length > 0 &&
      serialNumberData.model_number &&
      serialNumberData.unit_cost &&
      serialNumberData.total_cost_equipment &&
      serialNumberData.quantity &&
      serialNumberData.unit
    ) {
      const newEquipment = { ...serialNumberData };
      const updatedEquipment = [...formData.equipment, newEquipment];
      const newTotalCost = updatedEquipment.reduce(
        (sum, equipment) => sum + Number(equipment.unit_cost),
        0
      );
      setFormData({
        ...formData,
        equipment: updatedEquipment,
        total_cost: newTotalCost,
      });
      setSerialNumberData({
        id: "",
        serial_numbers: [],
        model_number: "",
        unit_cost: "",
        total_cost_equipment: "",
        quantity: "",
        unit: "",
        current_serial_number: "",
      });
      setisAddEquipmentModal(false);
    } else {
      setError("Please fill in all equipment details");
    }
  };

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
  console.log(formData.equipment)

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleDelete = (index) =>{
    const updatedEquipment = formData.equipment.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      equipment: updatedEquipment,
      total_cost: updatedEquipment.reduce((sum, equipment) => sum + Number(equipment.unit_cost), 0),
    });
  }

  return (
    <div className="w-full min-h-screen py-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-pink-100 dark:bg-indigo-900/50 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-semibold  dark:text-white">New Equipment Procurement</h1>
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
                      <option  key={supplier.id} value={supplier.id}>
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
                <label className="block text-sm mb-2 text-slate-600 dark:text-white">Logistics*</label>
                <input
                  type="text"
                  name="logistics"
                  value={formData.logistics}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-slate-600 dark:text-white">Total Cost</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-white">₦</span>
                  <input
                    type="number"
                    name="total_cost"
                    value={formData.total_cost}
                    readOnly
                    className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Equipment List */}
          <div className="p-5 space-y-4">
            <h2 className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Equipment List
            </h2>
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Equipment</label>
              <button
                type="button"
                onClick={() => setisAddEquipmentModal(true)}
                className="inline-flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Equipment
              </button>
            </div>
            {formData.equipment.length > 0 ? (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Model</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Serials</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unit Cost</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                      
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {formData.equipment.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.model_number}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          <div className="flex flex-wrap gap-1">
                            {item.serial_numbers.map((sn, i) => (
                              <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                {sn}
                            
                              </span>
                              
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">₦{item.unit_cost}</td>
                               <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                <div className="flex gap-3 items-center">
                                  <span className="cursor-pointer" onClick={()=>{
                                    handleDelete(index)
                                  }}>delete</span>
                                  <span className="cursor-pointer" onClick={()=>{
                                    setisEditEquipmentModal(true)
                                  }}>edit</span>
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
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium rounded-lg text-white bg-pink-600 hover:bg-pink-700 flex items-center justify-center gap-2 min-w-[120px] ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : ""
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

      {/* Equipment Modal */}
      {isAddEquipmentModal && (
        <div className="fixed top-9 inset-0 z-50 flex items-center justify-center p-4 bg-white/30 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Equipment Details</h3>
                <button
                  onClick={() => setisAddEquipmentModal(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Equipment Type*</label>
                  <select
                    name="id"
                    value={serialNumberData.id}
                    onChange={handleSerialChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Equipment Type</option>
                    {equipmentTypes.map((eqType) => (
                      <option key={eqType.id} value={eqType.id}>
                        {eqType.name} ({eqType.type})
                      </option>
                    ))}
                  </select>
                </div>
                {[
                  "model_number",
                  "unit_cost",
                  "total_cost_equipment",
                  "quantity",
                  "unit"
                ].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {field.replace(/_/g, " ").toUpperCase()}*
                    </label>
                    <input
                      type={field.includes("cost") || field === "quantity" ? "number" : "text"}
                      name={field}
                      value={serialNumberData[field]}
                      onChange={handleSerialChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                ))}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Serial Numbers*</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="current_serial_number"
                      value={serialNumberData.current_serial_number}
                      onChange={handleSerialChange}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter serial number"
                    />
                    <button
                      type="button"
                      onClick={addSerialNumber}
                      className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
                {serialNumberData.serial_numbers.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Added Serials</label>
                    <div className="flex flex-wrap gap-2">
                      {serialNumberData.serial_numbers.map((sn, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs flex items-center">
                          {sn}
                          <button
                            type="button"
                            onClick={() => {
                              setSerialNumberData({
                                ...serialNumberData,
                                serial_numbers: serialNumberData.serial_numbers.filter((_, i) => i !== index)
                              });
                            }}
                            className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setisAddEquipmentModal(false)}
                  className="px-4 cursor-pointer py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addEquipment}
                  className="px-4 cursor-pointer py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
                >
                  Add Equipment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



      {isEditEquipmentModal && (
        <div className="fixed top-9 inset-0 z-50 flex items-center justify-center p-4 bg-white/30 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Equipment Details</h3>
                <button
                  onClick={() => setisEditEquipmentModal(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div>
                
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}